import mongoose from "mongoose";

// defining the schema for the astrophysical event

const eventSchema = new mongoose.Schema(
    {
        source : {
            type : String,
            required:true,
            trim:true,
        },
        type:{
            type:String,
            required:true,
            trim:true,
        },
        time:{
            type:Number,
            required:true,
            min : 0,
            max : 360,
        },
        dec:{
            type:Number,
            required:true,
            min:-90,
            max:90,
        },
        metadata:{
            type:Object,
            default:{},
        },
    },
    {
        timestanps : true,
    }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;

// Line-by-Line , Breakdown for my team to understand this Mongo DB schema

// import mongoose... → brings in mongoose to define schema.
// eventSchema → blueprint for each event document in MongoDB.
// source → string identifying data origin (e.g., GWOSC).
// type → string describing event type (gravitational wave, optical, etc.).
// time → Date type, required, since correlation depends on time.
// ra → right ascension (0–360°), required.
// dec → declination (-90° to +90°), required.
// metadata → free-form JSON object to store any extra info.
// { timestamps: true } → adds createdAt and updatedAt automatically.
// mongoose.model("Event", eventSchema) → registers the schema as Event model in MongoDB.