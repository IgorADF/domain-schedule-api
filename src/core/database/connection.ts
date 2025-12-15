import { Sequelize } from "sequelize-typescript";
import { Envs } from "../envs/envs.js";
import config from "./config/config.js";
import { SequelizeConfigType } from "./config/config-type.js";
import { SellerModel } from "./models/seller.js";
import { AgendaConfigsModel } from "./models/agenda-configs.js";
import { AgendaDayOfWeekModel } from "./models/agenda-day-of-week.js";
import { AgendaPeriodsModel } from "./models/agenda-periods.js";
import { OverwriteDayModel } from "./models/overwrite-day.js";

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
  models: [
    SellerModel,
    AgendaConfigsModel,
    AgendaDayOfWeekModel,
    AgendaPeriodsModel,
    OverwriteDayModel,
  ],
  logging: true,
});

export async function authenticateDbConnection() {
  await sequelizeConnection.authenticate();
}
