import { User } from "../entities/user.js";
import mysql from "mysql2";
import dotenv from "dotenv/config";
import bcrypt from "bcrypt";

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "tehwebpr",
});

export async function createUser({ username, password }) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return await User.create({ username, password });
  } else throw new Error("User already exists");
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  return user;
}
