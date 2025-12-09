import { Optional } from "../../core/@types/optional.js";
import { DefaultEntity } from "./_default.js";
import {
  InvalidMaxAdvancedNotiveValue,
  InvalidMinAdvancedNotiveValue,
} from "./errors/agenda-config.js";

export interface AgendaConfigProps {
  sellerId: string;
  maxDaysOfAdvancedNotice: number;
  minHoursOfAdvancedNotice?: number;
  timezone: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class AgendaConfig extends DefaultEntity<AgendaConfigProps> {
  static maxDaysOfAdvancedNoticeLimit = 365 * 2;
  static minHoursOfAdvancedNoticeLimit = 1;

  static create(
    props: Optional<AgendaConfigProps, "createdAt">,
    id?: string
  ): AgendaConfig {
    if (
      props.maxDaysOfAdvancedNotice > AgendaConfig.maxDaysOfAdvancedNoticeLimit
    ) {
      throw new InvalidMaxAdvancedNotiveValue();
    }

    if (
      props.minHoursOfAdvancedNotice &&
      props.minHoursOfAdvancedNotice <
        AgendaConfig.minHoursOfAdvancedNoticeLimit
    ) {
      throw new InvalidMinAdvancedNotiveValue();
    }

    const now = new Date();

    return new AgendaConfig(
      {
        ...props,
        createdAt: now,
        updatedAt: now,
      },
      id
    );
  }
}
