import { Envs } from "../../envs/envs.js";

export default {
  development: {
    username: Envs.DB_USERNAME,
    password: Envs.DB_PASSWORD,
    database: Envs.DB_NAME,
    host: Envs.DB_HOST,
    port: Envs.DB_PORT,
    dialect: "postgres",
    seederStorage: "sequelize",
  },
  test: {
    username: Envs.DB_USERNAME,
    password: Envs.DB_PASSWORD,
    database: Envs.DB_NAME,
    host: Envs.DB_HOST,
    port: Envs.DB_PORT,
    dialect: "postgres",
    seederStorage: "sequelize",
  },
  production: {
    username: Envs.DB_USERNAME,
    password: Envs.DB_PASSWORD,
    database: Envs.DB_NAME,
    host: Envs.DB_HOST,
    port: Envs.DB_PORT,
    dialect: "postgres",
    seederStorage: "sequelize",
  },
};
