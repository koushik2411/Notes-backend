import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({msg: "User exists"});

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        res.json({
            _id: user._id,
            name: user.name,
            email:user.email
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({msg: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({msg: "Invalid password"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.json({token});
    } catch (err) {
        res.status(500).json(err);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({msg: "User not found" });

        const hashed = await bcrypt.hash(newPassword, 10);

        user.password = hashed;
        await user.save();

        res.json({ msg: "Password updated successfully" });

    } catch (err) {
        res.status(500).json(err);
    }
};