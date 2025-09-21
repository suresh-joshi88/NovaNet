// backend/seedDemo.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/NovaNet";
await mongoose.connect(MONGO, {});

console.log("Connected to", MONGO);

// helper: safe insert to collection
const upsertUser = async () => {
  const usersColl = mongoose.connection.collection("users");
  const email = "judge_demo@example.com";
  const existing = await usersColl.findOne({ email });
  if (existing) return existing;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("demoPass123", salt);
  const res = await usersColl.insertOne({ name: "Demo Judge", email, password: hash, createdAt: new Date() });
  return res.ops ? res.ops[0] : await usersColl.findOne({ email });
};

const createEvents = async () => {
  const eventsColl = mongoose.connection.collection("events");
  const now = new Date();
  const evs = [
    { source:"MockGW", type:"gravitational-wave", time: new Date(now.getTime()-1000*60*60).toISOString(), ra:197.45, dec:-23.38, metadata:{note:"GW sample"}, createdAt:new Date() },
    { source:"MockOptical", type:"optical", time: new Date(now.getTime()-1000*60*30).toISOString(), ra:197.5, dec:-23.4, metadata:{note:"Optical sample"}, createdAt:new Date() },
    { source:"MockNeutrino", type:"neutrino", time: new Date(now.getTime()-1000*60*20).toISOString(), ra:197.48, dec:-23.39, metadata:{note:"Neutrino sample"}, createdAt:new Date() }
  ];
  const insert = await eventsColl.insertMany(evs);
  return insert.insertedIds;
};

const createCluster = async (eventIds) => {
  const clustersColl = mongoose.connection.collection("clusters");
  const cluster = {
    score: 0.95,
    centroid:{ ra:197.48, dec:-23.39 },
    startTime: new Date(new Date().getTime()-1000*60*90),
    endTime: new Date(),
    events: [], // we will fetch events and embed them
    explanation: { note: "Demo cluster combining GW + optical + neutrino" },
    createdAt: new Date()
  };
  const evs = await mongoose.connection.collection("events").find({}).limit(10).toArray();
  cluster.events = evs;
  const r = await clustersColl.insertOne(cluster);
  return r.insertedId;
};

try {
  const user = await upsertUser();
  console.log("Demo user ready:", user.email || user);
  const ids = await createEvents();
  console.log("Inserted events:", Object.values(ids).length);
  const cid = await createCluster(ids);
  console.log("Inserted demo cluster id:", cid.toString());
} catch(err){
  console.error(err);
}
process.exit(0);
