import express from "express";
import { createUser, loginUser } from "../dataAccess/userDa.js";
import jwt from "jsonwebtoken";
import authenticateToken from "../middleware.js";

let userRouter = express.Router();

userRouter.route("/create").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username.endsWith("@stud.ase.ro")) {
      res.status(400).json({
        message:
          "Username must be the same as the institutional email! (@stud.ase.ro)",
      });
    } else if (password.length < 3) {
      res.status(400).json({
        message: "Password too short!",
      });
    } else {
      const user = await createUser({ username, password });
      const token = jwt.sign(
        {
          id: user.dataValues.id,
          username: user.dataValues.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({ message: "User created", token });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await loginUser({ username, password });
    const token = jwt.sign(
      {
        id: user.dataValues.id,
        username: user.dataValues.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default userRouter;
