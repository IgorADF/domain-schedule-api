import { Class } from "../../@types/class.js";

export class Repository {
  constructor(private t: any) {}
}

export interface IUnitOfWork {
  transaction: any;
  _userRepository: Repository | null;

  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  createAndGetRepository<T>(classDef: Class, propName: keyof this): T;

  get userRepository(): Repository;
}
