import type { Server } from "node:http";
import cookie from "cookie";
import request, { type Response } from "supertest";

export async function createDefaultTestSeller(
	server: Server,
	userData: { email: string },
) {
	await request(server).post("/sellers").send({
		name: "Default Seller Name",
		email: userData.email,
		password: "password123",
	});
}

export function parseSellerCookies(response: Response) {
	const cookieSatString = response?.headers?.["set-cookie"]?.[0];
	const cookieSrtString = response?.headers?.["set-cookie"]?.[1];
	const cookieSat = cookie.parseSetCookie(cookieSatString);
	const cookieSrt = cookie.parseSetCookie(cookieSrtString);

	return {
		cookieSat,
		cookieSrt,
	};
}

export async function authDefaultTestSeller(
	server: Server,
	userData: { email: string },
) {
	const response = await request(server).post("/sellers/auth").send({
		email: userData.email,
		password: "password123",
	});

	const { cookieSat, cookieSrt } = parseSellerCookies(response);

	const formattedCookieSat = cookieSat.name + "=" + cookieSat.value;
	const formattedCookieSrt = cookieSrt.name + "=" + cookieSrt.value;

	return [formattedCookieSat, formattedCookieSrt];
}
