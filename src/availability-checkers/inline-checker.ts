import fs from 'node:fs/promises';
import { type IBrowserProvider } from '../browser-providers/types';
import { type IAvailabilityResultHandler } from '../availability-result-handlers/types';
import { CheckItem, type BookingCapacityResponse, type DayAvailability } from '../types';
import { type IAvailabilityChecker } from './types';

export default class InlineChecker implements IAvailabilityChecker {
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

      const mkDirPromise = fs.mkdir('./snapshots', { recursive: true });
      const screenshotPromise = page.screenshot({ path: './snapshots/debug-screenshot.png', fullPage: true });

      console.log('Waiting for API `booking-capacities` response...');
      const response = await page.waitForResponse(response =>
        response.url().includes('booking-capacitiesV3') && response.status() === 200
        , { timeout: 60000 });

      const saveResponsePromise = fs.writeFile('./snapshots/booking-capacities-response.json', await response.body());

      const result = this.analyzeResponse(target.bookingSize, await response.json());
      console.log(`${result.length} day(s) available`);

      await this.resultHandler.process(result);

      await Promise.all([mkDirPromise, screenshotPromise, saveResponsePromise]);
    } catch (error) {
      throw new Error(`Error checking availability for '${target.name}'`, { cause: error });
    } finally {
      await browser.close();
    }
  }

  protected analyzeResponse(bookingSize: number, response: BookingCapacityResponse): DayAvailability[] {
    if (!response || !response.default) {
      console.log('No data to analyze');
      return [];
    }

    const dates = Object.entries(response.default);

    return dates
      .filter(([, details]) => {
        if (!details.times) return false;

        return Object.values(details.times).some(sizes =>
          sizes.includes(bookingSize)
        );
      })
      .map(([date, details]) => ({
        date: date,
        times: Object.entries(details.times)
          .filter(([, sizes]) => sizes.includes(bookingSize))
          .map(([time]) => time)
      }));
  }
}