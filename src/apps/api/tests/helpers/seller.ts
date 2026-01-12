import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import cookie from "cookie";
import request, { type Response } from "supertest";
import {
	type CreationCompleteAgendaDataType,
	createDefaultTestAgendaConfig,
} from "./agenda.js";

export async function createTestSeller(
	server: Server,
	userData: { email: string },
) {
	await request(server).post("/sellers").send({
		name: "Default Seller Name",
		email: userData.email,
		password: "password123",
	});
}

export function parseResponseAuthCookies(response: Response) {
	const cookieSatString = response?.headers?.["set-cookie"]?.[0];
	const cookieSrtString = response?.headers?.["set-cookie"]?.[1];
	const cookieSat = cookie.parseSetCookie(cookieSatString);
	const cookieSrt = cookie.parseSetCookie(cookieSrtString);

	return {
		cookieSat,
		cookieSrt,
	};
}

export function formatCookieToSetOnRequestHeader(cookieObj: {
	name: string;
	value: string | undefined;
}) {
	return cookieObj.name + "=" + cookieObj.value;
}

export async function authTestSeller(
	server: Server,
	userData: { email: string },
) {
	const response = await request(server).post("/sellers/auth").send({
		email: userData.email,
		password: "password123",
	});

	const { cookieSat, cookieSrt } = parseResponseAuthCookies(response);

	const formattedCookieSat = formatCookieToSetOnRequestHeader({
		name: cookieSat.name,
		value: cookieSat.value,
	});

	const formattedCookieSrt = formatCookieToSetOnRequestHeader({
		name: cookieSrt.name,
		value: cookieSrt.value,
	});

	return {
		formattedCookies: [formattedCookieSat, formattedCookieSrt],
		cookieSat: { name: cookieSat.name, value: cookieSat.value },
		cookieSrt: { name: cookieSrt.name, value: cookieSrt.value },
	};
}

export async function createAndAuthTestSeller(server: Server) {
	const testSellerEmail = `${randomUUID()}@example.com`;

	await createTestSeller(server, { email: testSellerEmail });

	const authData = await authTestSeller(server, {
		email: testSellerEmail,
	});

	return authData;
}

export async function setSellerInitialTestData(
	server: Server,
	completeAgendaData?: CreationCompleteAgendaDataType,
) {
	const authData = await createAndAuthTestSeller(server);
	const agendaConfigId = await createDefaultTestAgendaConfig(
		server,
		authData.formattedCookies,
		completeAgendaData,
	);

	return { authData, agendaConfigId };
}
