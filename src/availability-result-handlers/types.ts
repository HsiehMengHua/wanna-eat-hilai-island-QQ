import { type DayAvailability } from '../types.js';

export interface IAvailabilityResultHandler {
    process(name: string, result: DayAvailability[]): Promise<void>;
}