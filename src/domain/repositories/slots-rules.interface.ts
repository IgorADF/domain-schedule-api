import { SlotRules } from "../entities/slot-rules.js";

export interface SlotRulesRepository {
  getBySellerId(sellerId: string): Promise<SlotRules[]>;
}
