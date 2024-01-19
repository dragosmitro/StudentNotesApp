import { Access } from "../entities/access.js";
import { accessTypes } from "../utils/consts.js";
import mysql from "mysql2";
import dotenv from "dotenv/config";

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "tehwebpr",
});

export async function createAccess({ noteid, userid, index }) {
  const type = accessTypes[index];
  return await Access.create({
    noteid,
    userid,
    type,
  });
}

export async function getAccess({ userid }) {
  try {
    const accessList = await Access.findAll({
      where: {
        userid: userid,
      },
    });
    return accessList;
  } catch (error) {
    console.log("Error fetching access entities:", error);
    throw error;
  }
}

export async function deleteAccessByNoteId(noteId) {
  try {
    const result = await Access.destroy({
      where: {
        noteid: noteId,
      },
    });
    return result;
  } catch (error) {
    console.log("Error deleting access entries:", error);
    throw error;
  }
}
