import mongoose from "mongoose";
import Note from "../models/Note.js";

export const createNote = async (req, res) => {
  try {
    const { title, content, color } = req.body;

    const note = await Note.create({
      userId: req.user.id,
      title,
      content,
      color, // ✅ important
    });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error creating note" });
  }
};

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            userId: new mongoose.Types.ObjectId(req.user)
        }).sort({ createdAt: -1 });

        res.json(notes);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, color } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.color = color || note.color;

    const updated = await note.save();

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // optional (important for security)
    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();

    res.json({ message: "Note deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};