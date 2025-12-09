import { Class } from "../../@types/class.js";
import { IUnitOfWork, Repository } from "./unit-of-work.js";

export class SequelizeUnitOfWork implements IUnitOfWork {
  transaction: any;
  _userRepository: Repository | null;

  constructor() {
    this.transaction = null;
    this._userRepository = null;
  }

  async begin() {
    this.transaction = null;
  }

  async commit() {
    await this.transaction.commit();
    this.transaction = null;
  }

  async rollback() {
    if (this.transaction) {
      await this.transaction.rollback();
      this.transaction = null;
    }
  }

  createAndGetRepository<T>(ClassDef: Class, propName: keyof this) {
    if (!this[propName]) {
      this[propName] = new ClassDef(this.transaction);
    }

    return this[propName] as T;
  }

  //   get userRepository() {
  //     if (!this._userRepository) {
  //       //   this._userRepository = new UserRepositoryKnex(this.transaction);
  //       this._userRepository = new Repository(this.transaction);
  //     }
  //     return this._userRepository;
  //   }

  get userRepository() {
    return this.createAndGetRepository<Repository>(
      Repository,
      "_userRepository"
    );
  }
}
