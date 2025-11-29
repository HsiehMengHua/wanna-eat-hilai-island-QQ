import { type IAvailabilityResultHandler } from "../availability-result-handlers/types.js";
import { type IBrowserProvider } from "../browser-providers/types.js";
import { DayAvailability } from "../types.js";
import { type IAvailabilityChecker } from "./types.js";
import fs from 'node:fs/promises';

export default class EztableChecker implements IAvailabilityChecker {
    private browserProvider: IBrowserProvider;
    private resultHandler: IAvailabilityResultHandler;

    constructor(browserProvider: IBrowserProvider, resultHandler: IAvailabilityResultHandler) {
        this.browserProvider = browserProvider;
        this.resultHandler = resultHandler;
    }

    async check(pageUrl: string, bookingSize: number): Promise<void> {
        const [browser, page] = await this.browserProvider.launchPage();

        try {
            console.log('Navigating to reservation page...');
            await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

            const modalCloseLocator = page.locator('.ijwfSP.open .htQmZe');
            if (await modalCloseLocator.count() > 0) {
                await modalCloseLocator.click();
            }

            const peopleSelectLocator = page.locator('.desktop .dESOMr');
            await peopleSelectLocator.click();

            const peopleOptionLocator = peopleSelectLocator.locator(`option[value="${bookingSize}"]`);
            if (await peopleOptionLocator.count() === 0 || await peopleOptionLocator.getAttribute('disabled') !== null) {
                console.log(`No available days for ${bookingSize} person(s)`);
                return;
            }

            await peopleSelectLocator.selectOption('' + bookingSize);

            const calendarLocator = page.locator('.desktop .rdp-month');
            await calendarLocator.waitFor();

            const mkDirPromise = fs.mkdir('./snapshots', { recursive: true });
            const screenshotPromise = page.screenshot({ path: './snapshots/debug-screenshot-eztable.png', fullPage: true });

            const yearMonth = await calendarLocator.locator('.rdp-caption_label').textContent();
            if (!yearMonth) {
                throw new Error(`Cannot retrieve year and month from the calendar`);
            }

            const dayLocators = await calendarLocator.locator('.rdp-day:not(.rdp-disabled)').all();
            const dates = [];

            for (const locator of dayLocators) {
                dates.push(`${yearMonth.replaceAll(/\s/g, '')}/${await locator.textContent()}`);
            }

            // todo: retreive time slots
            // todo: retreive dates from next months

            await this.resultHandler.process(dates.map(x => ({ date: x, times: [] } as DayAvailability)));

            await Promise.all([mkDirPromise, screenshotPromise]);

        } catch (error) {
            throw new Error(`Error checking availability of the page '${pageUrl}'`, { cause: error });
        } finally {
            await browser.close();
        }
    }
}