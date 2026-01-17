export function setSchemaSearchParamToUrl(
	baseDbUrl: string,
	schemaName: string,
) {
	const url = new URL(baseDbUrl);
	url.searchParams.set("schema", schemaName);
	return { url: url.toString() };
}

export function getSchemaSearchParamFromUrl(baseDbUrl: string) {
	const url = new URL(baseDbUrl);
	const schemaName = url.searchParams.get("schema");
	return { schemaName };
}
