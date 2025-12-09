import { DefaultEntityError } from "./_default.js";

export class InvalidMaxAdvancedNotiveValue extends DefaultEntityError {
  constructor() {
    super(
      "maxDaysOfAdvancedNotice cannot be greater than 2",
      "InvalidMaxAdvancedNotiveValue",
      "AgendaConfig"
    );
  }
}

export class InvalidMinAdvancedNotiveValue extends DefaultEntityError {
  constructor() {
    super(
      "minHoursOfAdvancedNotice cannot be less than 1",
      "InvalidMinAdvancedNotiveValue",
      "AgendaConfig"
    );
  }
}
