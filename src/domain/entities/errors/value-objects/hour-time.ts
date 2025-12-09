import { DefaultEntityError } from "../_default.js";

export class InvalidHourValue extends DefaultEntityError {
  constructor() {
    super("Hour must be between 0 and 23", "InvalidHourValue", "HourTime");
  }
}

export class InvalidMinutesValue extends DefaultEntityError {
  constructor() {
    super(
      "Minutes must be between 0 and 59",
      "InvalidMinutesValue",
      "HourTime"
    );
  }
}
