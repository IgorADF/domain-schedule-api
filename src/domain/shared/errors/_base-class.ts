export class DefaultUseCaseError extends Error {
	uniqueCode: string;
	constructor(uniqueCode: string, message: string) {
		super(message);
		this.uniqueCode = uniqueCode;
	}
}
