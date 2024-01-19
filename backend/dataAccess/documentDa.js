import { Document } from "../entities/document.js";
import mysql from "mysql2";
import dotenv from "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "tehwebpr",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createDocument(noteId, filePath, fileName) {
  try {
    const newDocument = await Document.create({
      noteid: noteId,
      path: filePath,
      filename: fileName,
    });
    return newDocument;
  } catch (error) {
    console.error("Error creating a new document: ", error);
    throw error;
  }
}

export async function getDocumentsByNoteId(noteId) {
  try {
    const documents = await Document.findAll({
      where: {
        noteid: noteId,
      },
    });
    return documents;
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    throw error;
  }
}

export async function getDocumentById(documentId) {
  try {
    const document = await Document.findOne({ where: { id: documentId } });

    if (!document) {
      throw new Error("Document not found");
    }

    return document;
  } catch (error) {
    console.error("Error retrieving the document: ", error);
    throw error;
  }
}

export async function deleteDocumentsByNoteId(noteId) {
  try {
    const documents = await Document.findAll({
      where: {
        noteid: noteId,
      },
    });

    documents.forEach((document) => {
      const filePath = path.join(__dirname, "..", document.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    const result = await Document.destroy({
      where: {
        noteid: noteId,
      },
    });

    return result;
  } catch (error) {
    console.error("Error deleting documents: ", error);
    throw error;
  }
}

export async function deleteDocumentById(documentId) {
  try {
    const document = await Document.findOne({ where: { id: documentId } });

    if (document) {
      const filePath = path.join(__dirname, "..", document.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const result = await Document.destroy({
      where: {
        id: documentId,
      },
    });

    return result;
  } catch (error) {
    console.error("Error deleting the document: ", error);
    throw error;
  }
}
