import { chromium } from 'playwright';
import fs from 'node:fs/promises';

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
  private pageUrl: string;
  private bookingSize: number;  

  constructor(pageUrl: string, bookingSize: number) {
    this.pageUrl = pageUrl;
    this.bookingSize = bookingSize;
  }

  async check(): Promise<void> {
    const browser = await chromium.launch({
      headless: true  // Set to true for background running
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    try {
      console.log('Navigating to reservation page...');

      await page.goto(this.pageUrl, { waitUntil: 'domcontentloaded' });

      const response = await page.waitForResponse(response =>
          response.url().includes('booking-capacitiesV3') && response.status() === 200
      );

      const saveResponsePromise = fs.writeFile('./snapshots/booking-capacities-response.json', await response.body());
      const screenshotPromise = page.screenshot({path: './snapshots/debug-screenshot.png', fullPage: true});
      const jsonPromise = response.json();
      const [,,jsonData] = await Promise.all([saveResponsePromise, screenshotPromise, jsonPromise]);

      const result = this.analyzeResponse(jsonData);
      this.print(result);
    } catch (error) {
      console.error('Error checking availability:', (error as Error).message);
    } finally {
      await browser.close();
    }
  }

  protected analyzeResponse(response: BookingCapacityResponse): DayAvailability[] {
    if (!response || !response.default) {
      console.log('No data to analyze');
      return [];
    }

    const dates = Object.entries(response.default);

    return dates
      .filter(([, details]) => {
        if (!details.times) return false;

        return Object.values(details.times).some(sizes =>
          sizes.includes(this.bookingSize)
        );
      })
      .map(([date, details]) => ({
        date: date, 
        times: Object.entries(details.times)
          .filter(([, sizes]) => sizes.includes(this.bookingSize))
          .map(([time]) => time)
      }));  
  }

  private print(result: DayAvailability[]) {
    console.log(`\n=== AVAILABILITY FOR ${this.bookingSize} PERSON(S) ===`);

    if (result.length === 0) {
      console.log(`❌ NO AVAILABILITY - No slots available for ${this.bookingSize} persons`);
      return;
    }

    console.log(`✅ AVAILABILITY FOUND - ${result.length} day(s) available for ${this.bookingSize} persons\n`);

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