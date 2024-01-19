import express from "express";
import authenticateToken from "../middleware.js";
import {
  createNote,
  getNotesByIdList,
  deleteNote,
  updateNote,
} from "../dataAccess/noteDa.js";
import { deleteAccessByNoteId } from "../dataAccess/accessDa.js";
import { deleteDocumentsByNoteId } from "../dataAccess/documentDa.js";

let noteRoutes = express.Router();

noteRoutes.post("/create", authenticateToken, async (req, res) => {
  const { title, content, tag } = req.body;

  try {
    const newNote = await createNote({ title, content, tag });
    res.status(201).json(newNote);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating the note", error: err.message });
  }
});

noteRoutes.post("/ids", authenticateToken, async (req, res) => {
  const ids = req.body.noteids;

  try {
    const notes = await getNotesByIdList({ noteids: ids });
    res.status(200).json(notes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting the notes", error: err.message });
  }
});

noteRoutes.delete("/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id;

  if (!noteId) {
    return res.status(400).json({ message: "Note ID is required." });
  }

  try {
    const result = await deleteNote(noteId);
    if (result === 0) {
      return res.status(404).json({ message: "Note not found." });
    }
    await deleteAccessByNoteId(noteId);
    await deleteDocumentsByNoteId(noteId);
    res
      .status(200)
      .json({ message: `Note with ID ${noteId} was deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the note." });
  }
});

noteRoutes.patch("/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id;
  const { title, content, tag } = req.body;

  try {
    const updatedNote = await updateNote({ noteId, title, content, tag });
    res.status(200).json({
      message: `Note with ID ${noteId} was updated successfully.`,
      updatedNote: updatedNote,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating the note." });
  }
});

export default noteRoutes;
