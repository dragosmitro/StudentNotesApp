import { Sequelize } from "sequelize";
import db from "../dbConfig.js";

export const Access = db.define("access", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "user",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  noteid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "note",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
