import AvailabilityChecker from './availability-checker.js';
import ConsoleOutput from './availability-result-handlers/ConsoleOutput.js';
import Local from './browser-providers/local.js';
import WebShare from './proxy-providers/webshare.js';
// import ZenRows from './browser-providers/zenrows.js';

const URL = 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8'; // Taipei
// const URL = 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-OUYVD5L8af9l-fOxBi5'; // kaohsiung
const BOOKING_SIZE = 2;

const browserProvider = new Local(new WebShare());
// const browserProvider = new ZenRows();
const checker = new AvailabilityChecker(browserProvider, new ConsoleOutput());
checker.check(URL, BOOKING_SIZE);