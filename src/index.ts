import AvailabilityChecker from './availability-checker';

const URL = 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8'; // Taipei
// const URL = 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-OUYVD5L8af9l-fOxBi5'; // kaohsiung
const BOOKING_SIZE = 2;

const checker = new AvailabilityChecker(URL, BOOKING_SIZE);
checker.check();