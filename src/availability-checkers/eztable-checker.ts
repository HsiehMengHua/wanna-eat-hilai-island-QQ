import { Locator, type Page } from 'playwright';
import { type IAvailabilityResultHandler } from '../availability-result-handlers/types';
import { type IBrowserProvider } from '../browser-providers/types';
import { type CheckItem, type DayAvailability } from '../types';
import { type IAvailabilityChecker } from './types';
import fs from 'node:fs/promises';

export default class EztableChecker implements IAvailabilityChecker {
    private browserProvider: IBrowserProvider;
    private resultHandler: IAvailabilityResultHandler;

    readonly PEOPLE_SELECT_SELECTOR: string = '.desktop .dESOMr';
    readonly CALENDAR_SELECTOR: string = '.desktop .rdp-months';
    readonly ACTIVE_DAY_SELECTOR: string = '.rdp-day:not(.rdp-disabled):not(.rdp-hidden):not(.rdp-outside)';
    readonly NEXT_MONTH_SELECTOR: string = '.rdp-button_next';
    readonly MONTH_CAPTION_SELECTOR = '.rdp-caption_label';

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

            const peopleSelectLocator = page.locator(this.PEOPLE_SELECT_SELECTOR);
            if (!await this.checkBookingSize(peopleSelectLocator, target.bookingSize)) {
                console.log(`No available days for ${target.bookingSize} person(s)`);
                return;
            }

            await peopleSelectLocator.selectOption('' + target.bookingSize);

            const calendarLocator = page.locator(this.CALENDAR_SELECTOR);
            await calendarLocator.waitFor();

            const mkDirPromise = fs.mkdir('./snapshots', { recursive: true });
            const screenshotPromise = page.screenshot({ path: './snapshots/debug-screenshot-eztable.png', fullPage: true });

            const dates = [];

            for (let i = 0; i < 3; i++) {
                const dayLocators = await calendarLocator.locator(this.ACTIVE_DAY_SELECTOR).all();
                dates.push(...await Promise.all(dayLocators.map(async x => await x.getAttribute('data-day'))));

                const nextMonthLocator = calendarLocator.locator(this.NEXT_MONTH_SELECTOR);
                const hasNextMonth = await nextMonthLocator.getAttribute('aria-disabled') !== 'true';
                if (!hasNextMonth) {
                    break;
                }

                await nextMonthLocator.click();
            }

            await this.resultHandler.process(target.name, dates.map(x => ({ date: x, times: [] } as DayAvailability)));

            await Promise.allSettled([mkDirPromise, screenshotPromise]);
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