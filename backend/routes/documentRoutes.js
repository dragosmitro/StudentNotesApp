import mysql from "mysql2";
import dotenv from "dotenv/config";
import authenticateToken from "../middleware.js";
import { createDocument } from "../dataAccess/documentDa.js";
import express from "express";
import multer from "multer";
import path from "path";
import {
  getDocumentsByNoteId,
  getDocumentById,
  deleteDocumentById,
} from "../dataAccess/documentDa.js";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "tehwebpr",
});

let documentRoutes = express.Router();

documentRoutes.post(
  "/:noteid",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const { id, username } = req.user;
    const { noteid } = req.params;

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const filepath = req.file.path;

    try {
      const document = await createDocument(
        noteid,
        filepath,
        req.file.originalname
      );
      res.status(200).json({
        message: "File uploaded and data saved successfully",
        document,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

documentRoutes.get("/:noteid", authenticateToken, async (req, res) => {
  const { noteid } = req.params;

  try {
    const documents = await getDocumentsByNoteId(noteid);
    res.status(200).json({
      message: "Documents retrieved successfully",
      documents,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

documentRoutes.get("/download/:documentId", async (req, res) => {
  const { documentId } = req.params;

  try {
    const document = await getDocumentById(documentId);
    const filePath = path.join(__dirname, "..", document.path);
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + document.filename
    );
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error sending the file: ", error);
    res.status(500).send("Error sending the file.");
  }
});

documentRoutes.delete("/delete/:docId", authenticateToken, async (req, res) => {
  const { docId } = req.params;

  try {
    const result = await deleteDocumentById(docId);
    res
      .status(200)
      .json({
        message: "Document and file successfully deleted.",
        rowsDeleted: result,
      });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Error deleting document." });
  }
});

export default documentRoutes;
