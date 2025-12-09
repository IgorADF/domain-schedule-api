import { Optional } from "./optional.js";

export type OptionalId<T extends { id: string }> = Optional<T, "id">;
