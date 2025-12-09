export class DefaultEntityError extends Error {
  code: string;
  entityName: string;

  constructor(message: string, code: string, entityName: string) {
    super(message);
    this.code = code;
    this.entityName = entityName;
  }
}
