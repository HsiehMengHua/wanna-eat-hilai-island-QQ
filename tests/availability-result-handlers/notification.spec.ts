import '@jest/globals';
import Notification from '../../src/availability-result-handlers/notification';
import { DayAvailability } from '../../src/types';

describe('Test Proxy Provider - WebShare', () => {
    const originalFetch = global.fetch;
    const mockFetch = jest.fn();

    beforeAll(() => {
        global.fetch = mockFetch as unknown as typeof fetch;
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not push notification if no availability', async () => {
        const sut = new Notification();
        const mockResult: DayAvailability[] = [];

        await sut.process(mockResult);

        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('get all and return in the type `Proxy`', async () => {
        const sut = new Notification();
        const mockResult = [{ date: '2026/01/01', times: ['14:15'] }, { date: '2026/01/02', times: ['14:15'] }];

        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
        });

        await sut.process(mockResult);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('https://api.day.app'), expect.objectContaining({
            body: expect.stringContaining('2026/01/01、2026/01/02')
        }));
    });
});