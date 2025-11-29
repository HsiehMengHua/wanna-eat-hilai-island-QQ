import { Locator, type Page } from 'playwright';
import { type IAvailabilityResultHandler } from '../availability-result-handlers/types';
import { type IBrowserProvider } from '../browser-providers/types';
import { type CheckItem, type DayAvailability } from '../types';
import { type IAvailabilityChecker } from './types';
import fs from 'node:fs/promises';

export default class EztableChecker implements IAvailabilityChecker {
    private browserProvider: IBrowserProvider;
    private resultHandler: IAvailabilityResultHandler;

    constructor(browserProvider: IBrowserProvider, resultHandler: IAvailabilityResultHandler) {
        this.browserProvider = browserProvider;
        this.resultHandler = resultHandler;
    }

    async check(target: CheckItem): Promise<void> {
        const [browser, page] = await this.browserProvider.launchPage();

        try {
            console.log(`Navigating to reservation page for '${target.name}'...`);
            await page.goto(target.pageUrl, { waitUntil: 'domcontentloaded' });

            await this.closeAdIfPresent(page);

            const peopleSelectLocator = page.locator('.desktop .dESOMr');
            if (!await this.checkBookingSize(peopleSelectLocator, target.bookingSize)) {
                console.log(`No available days for ${target.bookingSize} person(s)`);
                return;
            }

            await peopleSelectLocator.selectOption('' + target.bookingSize);

            const calendarLocator = page.locator('.desktop .rdp-month');
            await calendarLocator.waitFor();

            const mkDirPromise = fs.mkdir('./snapshots', { recursive: true });
            const screenshotPromise = page.screenshot({ path: './snapshots/debug-screenshot-eztable.png', fullPage: true });

            const yearMonth = await calendarLocator.locator('.rdp-caption_label').textContent();
            if (!yearMonth) {
                throw new Error('Cannot retrieve year and month from the calendar');
            }

            const dayLocators = await calendarLocator.locator('.rdp-day:not(.rdp-disabled)').all();
            const dates = [];

            for (const locator of dayLocators) {
                dates.push(`${yearMonth.replaceAll(/\s/g, '')}/${await locator.textContent()}`);
            }

            // todo: retreive time slots
            // todo: retreive dates from next months

            await this.resultHandler.process(target.name, dates.map(x => ({ date: x, times: [] } as DayAvailability)));

            await Promise.all([mkDirPromise, screenshotPromise]);

        } catch (error) {
            throw new Error(`Error checking availability for '${target.name}'`, { cause: error });
        } finally {
            await browser.close();
        }
    }

    private async closeAdIfPresent(page: Page) {
        const modalCloseLocator = page.locator('.ijwfSP.open .htQmZe');
        if (await modalCloseLocator.count() > 0) {
            await modalCloseLocator.click();
        }
    }

    private async checkBookingSize(peopleSelectLocator: Locator, bookingSize: number) {
        await peopleSelectLocator.click();
        const peopleOptionLocator = peopleSelectLocator.locator(`option[value="${bookingSize}"]`);
        return await peopleOptionLocator.count() > 0 && await peopleOptionLocator.getAttribute('disabled') === null;
    }
}