import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

// Middlewares that I am using 
app.use(cors());
app.use(express.json());

// For testing Routes
app.get("/",(req,res) => {
    res.send("NovaNet Backend is Running");
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected SuccessFully !");
        app.listen(process.env.PORT,()=>
        console.log(`Sevrer Running SuccessFully at port ${process.env.PORT}`)
    );
})
.catch((err) => console.error("MongoDB Connection Error : " ,err));