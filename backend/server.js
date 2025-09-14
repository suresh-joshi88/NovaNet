import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import eventRoutes from "./routes/eventRoutes.js";
import correlationRoutes from "./routes/correlationRoutes.js";

dotenv.config();

const app = express();

// Middlewares that I am using 
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/events",protect,eventRoutes);
app.use("/api",correlationRoutes);

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

// Routes 
app.use("/api",eventRoutes);