import '@jest/globals';
import AvailabilityChecker from '../src/availability-checker';
import { type IBrowserProvider } from '../src/browser-providers/types';
import { type BookingCapacityResponse, type DayAvailability } from '../src/types';
import { type IAvailabilityResultHandler } from '../src/availability-result-handlers/types';

const mockProxyProvider: IBrowserProvider = {
    launchPage: jest.fn()
};

const mockResultHandler: IAvailabilityResultHandler = {
    process: jest.fn()
};

describe('Booking Availability Analysis', () => {
    let checker: AvailabilityCheckerForTest;

    beforeEach(() => {
        jest.clearAllMocks();
        checker = new AvailabilityCheckerForTest(mockProxyProvider, mockResultHandler);
    });

    it('3 dates have time slots but only 2 dates are available for 2 persons', () => {
        const bookingSize = 2;
        const response: BookingCapacityResponse = {
            default: {
                "2026-01-01": {
                    times: {
                        "14:15": [1, 2]
                    },
                    dinerTime: 0,
                    maxBookingSize: 7,
                    minBookingSize: 1,
                    status: "open"
                },
                "2026-01-02": {
                    times: {
                        "14:15": [1, 2, 3, 4, 5, 6, 7]
                    },
                    dinerTime: 0,
                    maxBookingSize: 7,
                    minBookingSize: 1,
                    status: "open"
                },
                "2026-01-03": {
                    times: {
                        "14:15": [3, 4, 5, 6, 7]
                    },
                    dinerTime: 0,
                    maxBookingSize: 7,
                    minBookingSize: 1,
                    status: "open"
                },
            }
        };

        const result = checker.analyzeResponse(bookingSize, response);

        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ date: "2026-01-01", times: ["14:15"] } as DayAvailability);
        expect(result).toContainEqual({ date: "2026-01-02", times: ["14:15"] } as DayAvailability);
    });

    it('A date has 3 time slots but only 2 slots are available for 2 persons', () => {
        const bookingSize = 2;
        const response: BookingCapacityResponse = {
            default: {
                "2026-01-01": {
                    times: {
                        "11:00": [1, 2],
                        "14:00": [1, 2, 3, 4],
                        "17:00": [5, 6, 7]
                    },
                    dinerTime: 0,
                    maxBookingSize: 7,
                    minBookingSize: 1,
                    status: "open"
                },
            }
        };

        const result = checker.analyzeResponse(bookingSize, response);

        expect(result).toHaveLength(1);
        expect(result).toContainEqual({ date: "2026-01-01", times: ["11:00", "14:00"] } as DayAvailability);
    });

    it('status is "open" for a date but no time slots', () => {
        const bookingSize = 2;
        const response: BookingCapacityResponse = {
            default: {
                "2026-01-01": {
                    times: {},
                    dinerTime: 0,
                    maxBookingSize: 7,
                    minBookingSize: 1,
                    status: "open"
                },
            }
        };

        const result = checker.analyzeResponse(bookingSize, response);

        expect(result).toHaveLength(0);
    });

    it('no "open" status', () => {
        const bookingSize = 2;
        const response: BookingCapacityResponse = {
            default: {
                "2026-01-01": {
                    times: {},
                    dinerTime: 0,
                    maxBookingSize: 7,
                    minBookingSize: 1,
                    status: "booking-off"
                },
                "2026-01-02": {
                    times: {},
                    dinerTime: 0,
                    maxBookingSize: 7,
                    minBookingSize: 1,
                    status: "full"
                },
                "2026-01-03": {
                    times: {},
                    dinerTime: 0,
                    maxBookingSize: 7,
                    minBookingSize: 1,
                    status: "closed"
                },
            }
        };

        const result = checker.analyzeResponse(bookingSize, response);

        expect(result).toHaveLength(0);
    });
});

class AvailabilityCheckerForTest extends AvailabilityChecker {
    analyzeResponse(bookingSize: number, response: BookingCapacityResponse): DayAvailability[] {
        return super.analyzeResponse(bookingSize, response);
    }
}