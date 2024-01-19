import { Note } from "../entities/note.js";
import mysql from "mysql2";
import dotenv from "dotenv/config";
import { Op } from "sequelize";

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "tehwebpr",
});

export async function createNote({ title, content, tag }) {
  try {
    const newNote = await Note.create({
      title,
      content,
      date: new Date(),
      tag,
    });
    return newNote;
  } catch (error) {
    console.log("Error creating the note:", error);
    throw error;
  }
}

export async function getNotesByIdList({ noteids }) {
  try {
    const notes = await Note.findAll({
      where: {
        id: {
          [Op.in]: noteids,
        },
      },
    });
    return notes;
  } catch (error) {
    console.log("Error getting notes", error);
    throw error;
  }
}

export async function deleteNote(noteId) {
  try {
    const result = await Note.destroy({
      where: {
        id: noteId,
      },
    });
    return result;
  } catch (error) {
    console.log("Error deleting the note:", error);
    throw error;
  }
}

export async function updateNote({ noteId, title, content, tag }) {
  try {
    const [numberOfAffectedRows, affectedRows] = await Note.update(
      {
        title,
        content,
        tag,
      },
      {
        where: {
          id: noteId,
        },
        returning: true,
      }
    );
    const updatedNote = affectedRows[0];
    return updatedNote;
  } catch (error) {
    console.log("Error updating the note:", error);
    throw error;
  }
}
