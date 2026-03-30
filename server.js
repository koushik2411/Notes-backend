import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin:"*",
<<<<<<< HEAD
    credentials:true
=======
    credentials: true
>>>>>>> 6549776ba7362bccce2274ed183e5bedee5fb9ad
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Test Route
app.get("/", (req,res) => {
    res.send("API is running...");
});

// MongoBD
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log("DB Error", err);
});
