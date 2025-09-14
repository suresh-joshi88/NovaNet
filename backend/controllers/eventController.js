import Event from "../models/Event.js";
import fs from "csv-parser";
import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { source, type, time, ra, dec, metadata } = req.body;

    if (!source || !type || time === undefined || ra === undefined || dec === undefined) {
      return res.status(400).json({ message: "Missing required fields: source,type,time,ra,dec" });
    }

    const parsedTime = new Date(time);
    if (isNaN(parsedTime.getTime())) {
      return res.status(400).json({ message: "Invalid time format. Use ISO string or epoch milliseconds." });
    }

    const parsedRa = Number(ra);
    const parsedDec = Number(dec);
    if (isNaN(parsedRa) || parsedRa < 0 || parsedRa > 360) {
      return res.status(400).json({ message: "ra must be a number in [0,360]" });
    }
    if (isNaN(parsedDec) || parsedDec < -90 || parsedDec > 90) {
      return res.status(400).json({ message: "dec must be a number in [-90,90]" });
    }

    const newEvent = new Event({
      source,
      type,
      time: parsedTime,
      ra: parsedRa,
      dec: parsedDec,
      metadata: metadata || {},
    });

    await newEvent.save();
    return res.status(201).json({ message: "Event created", event: newEvent });
  } catch (err) {
    console.error("createEvent error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 100);
    const skip = (page - 1) * limit;

    const total = await Event.countDocuments();
    const events = await Event.find().sort({ time: -1 }).skip(skip).limit(limit);

    return res.status(200).json({ page, limit, total, events });
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadEvents = async(req,res) => {
  try{
    if(!req.file) return res.status(400).json({message : "No File uploaded"});

    const events = [];
    const errors = [];
    const filePath = req.file.path;

    //Checking for the file type
    if(req.file.mimetype === "application/json"){
      const data = JSON.parse(fs.readFileSync(filePath,"utf-8"));
      data.forEach((item,i) => {
        try{
          const {source , type , time , ra , dec , metadata} = item;
          if (!source || !type || time === undefined || ra === undefined || dec === undefined)
            throw new Error("Missing required Fields");
          events.push({source,type,time:new Date(time),ra:Number(ra),dec:Number(dec),metadata:metadata || {}});
        } catch(err){
          errors.push({row : i+1 , error:err.message});
        }
      });
    } else if(req.file.mimetype === "text/csv"){
      // CSV Files
      await new Promise((resolve , reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data",(row) => {
            try{
              const {source , type , time , ra , dec , metadata} = row;
              if(!source || !type || !time || !ra || !dec) throw new Error("Missing required Fields");
              events.push({source , type,time:new DataTransfer(time),ra:Number(ra),dec:Number(dec),metadata:metadata ? JSON.parse(metadata) : {}});
            } catch (err) {
              errors.push({row : row , error:err.message});
            }
          })
          .on("end",resolve)
          .on("error",reject);
      });
    } else{
      return res.status(400).json({message : "Unsupported File type"});
    }

    //Inserting into MongoDB
    const inserted = await Event.insertMany(events);
    res.status(201).json({message : "Events Uploaded" , inserted : inserted.length,error});
  } catch (err) {
    console.error("uploadEvents Error : ",err);
    res.status(500).json({message : "Server Error"});
  } finally{
    if(req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
};
