import { chromium } from 'playwright';
import fs from 'node:fs/promises';

// const URL = 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8';
const URL = 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-OUYVD5L8af9l-fOxBi5';
const TARGET_PARTY_SIZE = 2;

type BookingStatus = 'booking-off' | 'full' | 'closed' | 'open';

interface BookingCapacityDetails {
  times: Record<string, number[]>; // time slot -> available party sizes
  dinerTime: number;
  maxBookingSize: number;
  minBookingSize: number;
  status: BookingStatus;
}

interface BookingCapacityResponse {
  default: Record<string, BookingCapacityDetails>; // date -> availability
}

interface DayAvailability {
  date: string
  times: string[]
}

async function checkAvailability(): Promise<void> {
  const browser = await chromium.launch({
    headless: false  // Set to true for background running
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to reservation page...');

    page.on('response', async response => {
      const url = response.url();

      // the URL looks like `https://inline.app/api/booking-capacitiesV3?companyId=-NeqTSgDQOAYi30lg4a7%3Ainline-live-3&branchId=-NeqTStJZDIBQHEMSDI8`
      if (url.includes('booking-capacitiesV3')) {
        console.log('📡 Intercepted API call:', url);
        await fs.writeFile('./snapshots/booking-capacities-response.json', await response.body());
        await page.screenshot({path: './snapshots/debug-screenshot.png', fullPage: true});
        console.log("response status", response.status());

        const data = await response.json();
        const result = analyzeResponse(data);
        printAvailability(result);
      }
    });

    await page.goto(URL, { waitUntil: 'domcontentloaded' });
  } catch (error) {
    console.error('Error checking availability:', (error as Error).message);
  } finally {
    // await browser.close();
  }
}

function analyzeResponse(response: BookingCapacityResponse): DayAvailability[] {
  if (!response || !response.default) {
    console.log('No data to analyze');
    return [];
  }

  const dates = Object.entries(response.default);

  return dates
    .filter(([, details]) => {
      if (!details.times) return false;

      return Object.values(details.times).some(partySizes =>
        partySizes.includes(TARGET_PARTY_SIZE)
      );
    })
    .map(([date, details]) => ({
      date: date, 
      times: Object.entries(details.times)
        .filter(([, partySizes]) => partySizes.includes(TARGET_PARTY_SIZE))
        .map(([time]) => time)
    }));
}

function printAvailability(result: DayAvailability[]) {
  console.log(`\n=== AVAILABILITY FOR ${TARGET_PARTY_SIZE} PERSON(S) ===`);

  if (result.length === 0) {
    console.log(`❌ NO AVAILABILITY - No slots available for ${TARGET_PARTY_SIZE} persons`);
    return;
  }

  console.log(`✅ AVAILABILITY FOUND - ${result.length} day(s) available for ${TARGET_PARTY_SIZE} persons\n`);

  result.forEach(x => {
    console.log(`📅 ${x.date}`);
    console.log(`   Available time slots:`);
    x.times.forEach(time => {
      console.log(`      ✓ ${time}`);
    });
  });
}

checkAvailability();
