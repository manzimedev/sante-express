import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({
  path: "./config.env",
});

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
    define: {
      freezeTableName: true,
      timestamps: true,
    },
  }
);

export default sequelize;
