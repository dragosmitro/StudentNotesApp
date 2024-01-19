import mysql from "mysql2";
import dotenv from "dotenv/config";
import authenticateToken from "../middleware.js";
import { createAccess, getAccess } from "../dataAccess/accessDa.js";
import express from "express";

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "tehwebpr",
});

let accessRoutes = express.Router();

accessRoutes.post("/create/:type", authenticateToken, async (req, res) => {
  const { id, username } = req.user;
  const { type } = req.params;
  const { noteid } = req.body;

  const userid = id;

  let index;
  switch (type) {
    case "creator":
      index = 0;
      break;
    case "shared":
      index = 1;
      break;
    case "group":
      index = 2;
      break;
    default:
      return res.status(400).json({ message: "Invalid access type" });
  }
  try {
    const access = await createAccess({ noteid, userid, index });
    res
      .status(201)
      .json({ message: "Access to the note granted successfully", access });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

accessRoutes.get("/:userid", authenticateToken, async (req, res) => {
  const { id, username } = req.user;
  const { userid } = req.params;

  try {
    const accessList = await getAccess({ userid });
    res
      .status(200)
      .json({ message: "Access list succesfully retrieved", accessList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default accessRoutes;
