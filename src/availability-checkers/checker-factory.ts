import { type IAvailabilityResultHandler } from '../availability-result-handlers/types';
import { type IBrowserProvider } from '../browser-providers/types';
import EztableChecker from './eztable-checker';
import InlineChecker from './inline-checker';
import { type IAvailabilityChecker, type ICheckerFactory } from './types';

export default class CheckerFactory implements ICheckerFactory {
    private inlineChecker: IAvailabilityChecker;
    private eztableChecker: IAvailabilityChecker;

    constructor(browserProvider: IBrowserProvider, resultHandler: IAvailabilityResultHandler) {
        this.inlineChecker = new InlineChecker(browserProvider, resultHandler);
        this.eztableChecker = new EztableChecker(browserProvider, resultHandler);
    }

    get(url: string): IAvailabilityChecker | undefined {
        if (url.includes('https://inline.app')) {
            return this.inlineChecker;
        }

        if (url.includes('https://tw.eztable.com')) {
            return this.eztableChecker;
        }

        console.error(`Invalid URL '${url}'. The reservation website is not supported.`);
    }

}