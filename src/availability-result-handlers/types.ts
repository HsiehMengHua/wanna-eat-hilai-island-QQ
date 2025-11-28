import { DayAvailability } from "../types.js";

export interface IAvailabilityResultHandler {
    process(result: DayAvailability[]): Promise<void>;
}