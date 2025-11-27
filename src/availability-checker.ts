import fs from 'node:fs/promises';
import { type IBrowserProvider } from './browser-providers/types.js';

type BookingStatus = 'booking-off' | 'full' | 'closed' | 'open';

interface BookingCapacityDetails {
  times: Record<string, number[]>; // time slot -> available party sizes
  dinerTime: number;
  maxBookingSize: number;
  minBookingSize: number;
  status: BookingStatus;
}

export interface BookingCapacityResponse {
  default: Record<string, BookingCapacityDetails>; // date -> availability
}

export interface DayAvailability {
  date: string
  times: string[]
}

class AvailabilityChecker {
  private browserProvider: IBrowserProvider;

  constructor(proxyProvider: IBrowserProvider) {
    this.browserProvider = proxyProvider;
  }

  async check(pageUrl: string, bookingSize: number): Promise<void> {
    const [browser, page] = await this.browserProvider.launchPage();

    try {
      console.log('Navigating to reservation page...');
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

      const mkDirPromise = fs.mkdir('./snapshots', { recursive: true });
      const screenshotPromise = page.screenshot({ path: './snapshots/debug-screenshot.png', fullPage: true });

      console.log('Waiting for API `booking-capacities` response...');
      const response = await page.waitForResponse(response =>
        response.url().includes('booking-capacitiesV3') && response.status() === 200
        , { timeout: 60000 });

      const saveResponsePromise = fs.writeFile('./snapshots/booking-capacities-response.json', await response.body());

      const result = this.analyzeResponse(bookingSize, await response.json());
      this.print(result);

      await Promise.all([mkDirPromise, screenshotPromise, saveResponsePromise]);
    } catch (error) {
      throw Error('Error checking availability', { cause: error });
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

  private print(result: DayAvailability[]) {
    if (result.length === 0) {
      console.log(`❌ NO AVAILABILITY - No slots available`);
      return;
    }

    console.log(`✅ AVAILABILITY FOUND - ${result.length} day(s) available\n`);

    result.forEach(x => {
      console.log(`📅 ${x.date}`);
      console.log(`   Available time slots:`);
      x.times.forEach(time => {
        console.log(`      ✓ ${time}`);
      });
    });
  }
}

export default AvailabilityChecker;