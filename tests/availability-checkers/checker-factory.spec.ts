import '@jest/globals';
import CheckerFactory from '../../src/availability-checkers/checker-factory';
import InlineChecker from '../../src/availability-checkers/inline-checker';
import { type IAvailabilityResultHandler } from '../../src/availability-result-handlers/types';
import { type IBrowserProvider } from '../../src/browser-providers/types';
import EztableChecker from '../../src/availability-checkers/eztable-checker';

describe('Test Index', () => {
    const mockBrowserProvider: IBrowserProvider = {
        launchPage: jest.fn()
    };

    const mockResultHandler: IAvailabilityResultHandler = {
        process: jest.fn()
    };

    it('given an `inline` URL, should return InlineChecker instance', () => {
        const sut = new CheckerFactory(mockBrowserProvider, mockResultHandler);
        const inlineURL = 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8';

        const result = sut.get(inlineURL);

        expect(result).toBeInstanceOf(InlineChecker);
    });

    it('given an `EZTable` URL, should return EztableChecker instance', () => {
        const sut = new CheckerFactory(mockBrowserProvider, mockResultHandler);
        const inlineURL = 'https://tw.eztable.com/restaurant/17565';

        const result = sut.get(inlineURL);

        expect(result).toBeInstanceOf(EztableChecker);
    });
});