import { type DayAvailability } from '../types.js';
import { type IAvailabilityResultHandler } from './types.js';

export default class ConsoleOutput implements IAvailabilityResultHandler {
    process(name: string, result: DayAvailability[]): Promise<void> {
        if (result.length === 0) {
            console.log(`❌ NO AVAILABILITY for '${name}' - No slots available`);
            return Promise.resolve();
        }

        let outputStr = `✅ AVAILABILITY FOUND for '${name}' - ${result.length} day(s) available\n`;

        result.forEach(x => {
            outputStr += `📅 ${x.date}\n`;
            outputStr += '   Available time slots:\n';
            x.times.forEach(time => {
                outputStr += `      ✓ ${time}`;
            });
        });

        console.log(outputStr);

        return Promise.resolve();
    }

}