import type { Dialect } from "sequelize";

export type SequelizeConfigType = {
	username: string;
	password: string;
	database: string;
	host: string;
	port: number;
	dialect: Dialect;
	seederStorage?: string;
};
