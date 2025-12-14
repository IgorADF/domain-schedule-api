import { Sequelize } from "sequelize-typescript";
import { Envs } from "../envs/envs.js";
import config from "./config/config.js";
import { SequelizeConfigType } from "./config/config-type.js";
import { SellerModel } from "./models/seller.js";

const connectionConfig: SequelizeConfigType | undefined = config[
  Envs.NODE_ENV
] as any;

if (!connectionConfig) {
  throw new Error("Unable to find database configuration");
}

const { dialect, database, username, password, host, port } = connectionConfig;

export const sequelizeConnection = new Sequelize({
  dialect,
  database,
  username,
  password,
  host,
  port,
  models: [SellerModel],
  logging: true,
});

export async function authenticateDbConnection() {
  await sequelizeConnection.authenticate();
}
