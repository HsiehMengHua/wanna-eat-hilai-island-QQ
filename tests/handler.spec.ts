import '@jest/globals';
import Handler from '../src/handler';
import { type CheckItem } from '../src/types';

describe('Test Index', () => {
    const mockCheckerFactory = {
        get: jest.fn()
    };

    const mockChecker = {
        check: jest.fn()
    };

    it('given one of check process fails, the others should continue', async () => {
        const checkItems: CheckItem[] = [
            { PageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8', BookingSize: 2 },
            { PageUrl: 'https://tw.eztable.com/restaurant/17565', BookingSize: 2 },
        ];

        let success = 0;

        // the first call quickly fails
        mockChecker.check.mockReturnValueOnce(new Promise<void>((_, reject) => {
            setTimeout(() => reject(), 300);
        }));

        // the second call succeeds but takes longer
        mockChecker.check.mockReturnValueOnce(new Promise<void>((resolve) => {
            setTimeout(() => {
                success++;
                resolve();
            }, 1000);
        }));

        mockCheckerFactory.get.mockReturnValue(mockChecker);

        await new Handler(mockCheckerFactory).checkMultiple(checkItems);

        expect(success).toBe(1);
    });
});