import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv/config";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import accesRoutes from "./routes/accesRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

let app = express();
let router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  const start = new Date().getTime();
  res.on("finish", () => {
    const duration = new Date().getTime() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});
app.use("/api/user", userRouter);
app.use("/api/access", accesRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/document", documentRoutes);
let conn;

mysql
  .createConnection({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  })
  .then((connection) => {
    conn = connection;
    return connection.query("CREATE DATABASE IF NOT EXISTS tehwebpr");
  })
  .then(() => {
    return conn.end();
  })
  .catch((err) => {
    console.warn(err);
  });

app.listen(process.env.PORT ?? 2999, () => {
  console.log("Server running on port " + process.env.PORT ?? 2999);
});

// SQL CODE

// CREATE TABLE IF NOT EXISTS `user` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `username` varchar(50) NOT NULL,
//   `password` varchar(255) NOT NULL DEFAULT '',
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

// CREATE TABLE IF NOT EXISTS `note` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `content` longtext NOT NULL,
//   `title` varchar(50) NOT NULL DEFAULT '',
//   `date` datetime NOT NULL,
//   `tag` varchar(50) NOT NULL DEFAULT '',
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

// CREATE TABLE IF NOT EXISTS `access` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `userid` int(11) NOT NULL DEFAULT 0,
//   `noteid` int(11) NOT NULL DEFAULT 0,
//   `type` varchar(50) NOT NULL DEFAULT '0',
//   PRIMARY KEY (`id`),
//   KEY `userid` (`userid`),
//   KEY `noteid` (`noteid`)
// ) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

// CREATE TABLE IF NOT EXISTS `document` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `noteid` int(11) NOT NULL DEFAULT 0,
//   `path` varchar(50) NOT NULL DEFAULT '0',
//   `filename` varchar(50) DEFAULT NULL,
//   PRIMARY KEY (`id`),
//   KEY `noteid` (`noteid`)
// ) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
