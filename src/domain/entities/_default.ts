import { randomUUID } from "node:crypto";

export class DefaultEntity<T> {
  id: string;
  props: T;

  protected constructor(props: T, id?: string) {
    this.props = props;
    this.id = id ?? randomUUID();
  }
}
