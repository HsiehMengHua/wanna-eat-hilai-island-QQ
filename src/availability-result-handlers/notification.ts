import { DayAvailability } from '../types.js';
import { type IAvailabilityResultHandler } from './types.js';

// see the doc: https://bark.day.app/#/en-us/tutorial?id=request-parameters
interface BarkPayload {
    title?: string;
    subtitle?: string;
    body?: string;
    markdown?: string;
    device_key?: string;
    device_keys?: string[];
    level?: 'critical' | 'active' | 'timeSensitive' | 'passive';
    volume?: number;
    badge?: number;
    call?: '1';
    autoCopy?: '1';
    copy?: string;
    sound?: string;
    icon?: string;
    group?: string;
    ciphertext?: string;
    isArchive?: number;
    url?: string;
    action?: 'none';
    id?: string;
    delete?: '1';
}

export default class Notification implements IAvailabilityResultHandler {
    async process(name: string, result: DayAvailability[]): Promise<void> {
        if (result.length === 0) {
            return;
        }

        const url = 'https://api.day.app/ofWkNMgQWh4xP3Dv9PAZCV';
        const payload: BarkPayload = {
            title: `${name}有位置🤯🤯🤯 快去看！！！`,
            body: result.map(x => x.date).join('、'),
            group: 'hilai-island-availibility',
            url: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8'
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Fail pushing notification with status ${response.status}`, { cause: await response.text() });
        }
    }
}