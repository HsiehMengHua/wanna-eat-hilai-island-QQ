import { DayAvailability } from "../types.js";
import { IAvailabilityResultHandler } from "./types.js";

export default class ConsoleOutput implements IAvailabilityResultHandler {
    process(result: DayAvailability[]): Promise<void> {
        if (result.length === 0) {
            console.log(`❌ NO AVAILABILITY - No slots available`);
            return Promise.resolve();
        }

        console.log(`✅ AVAILABILITY FOUND - ${result.length} day(s) available\n`);

        result.forEach(x => {
            console.log(`📅 ${x.date}`);
            console.log(`   Available time slots:`);
            x.times.forEach(time => {
                console.log(`      ✓ ${time}`);
            });
        });

        return Promise.resolve();
    }

}