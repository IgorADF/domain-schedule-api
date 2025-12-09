import { DefaultEntityError } from "./_default.js";

export class InvalidMinIntervalValue extends DefaultEntityError {
  constructor() {
    super(
      "minutesOfInterval cannot be less than 5",
      "InvalidMinimumIntervalValue",
      "AgendaPeriod"
    );
  }
}
