import amqplib from "amqplib";
import { Envs } from "@/core/envs/envs.js";

let connection: amqplib.ChannelModel | null = null;
let channel: amqplib.Channel | null = null;

export async function getConnection(): Promise<amqplib.ChannelModel> {
	if (!connection) {
		connection = await amqplib.connect(Envs.URL_AMQP);
		console.log("✓ AMQP connection established");
	}
	return connection;
}

export async function getChannel(): Promise<amqplib.Channel> {
	if (!channel) {
		const conn = await getConnection();
		channel = await conn.createChannel();
		console.log("✓ AMQP channel created");
	}
	return channel;
}

export async function closeConnection(): Promise<void> {
	if (channel) {
		await channel.close();
		channel = null;
	}
	if (connection) {
		await connection.close();
		connection = null;
		console.log("✓ AMQP connection closed");
	}
}
