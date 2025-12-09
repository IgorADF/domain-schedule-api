import { DefaultEntity } from "./_default.js";

export interface OverwriteDayProps {
  agendaId: string;
  day: Date;
  cancelAllDay: boolean;
}

export class OverwriteDay extends DefaultEntity<OverwriteDayProps> {
  static create(props: OverwriteDayProps, id?: string): OverwriteDay {
    return new OverwriteDay(props, id);
  }
}
