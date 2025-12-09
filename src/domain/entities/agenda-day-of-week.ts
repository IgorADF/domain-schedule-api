import { DefaultEntity } from "./_default.js";

export interface AgendaDayOfWeekProps {
  agendaConfigId: string;
  dayOfWeek: number;
}

export class AgendaDayOfWeek extends DefaultEntity<AgendaDayOfWeekProps> {
  static create(props: AgendaDayOfWeekProps, id?: string): AgendaDayOfWeek {
    return new AgendaDayOfWeek(props, id);
  }
}
