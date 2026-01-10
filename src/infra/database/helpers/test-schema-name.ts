import { randomUUID } from "node:crypto";

export const testSchemaPrefixName = "test-schema-";

export const createTestSchemaName = () => testSchemaPrefixName + randomUUID();
