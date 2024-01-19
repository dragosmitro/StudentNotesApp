import { Sequelize } from "sequelize";
import db from "../dbConfig.js";

export const Document = db.define("document", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
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
  path: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
