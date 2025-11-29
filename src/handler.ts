import { type CheckItem } from './types';
import { type ICheckerFactory } from './availability-checkers/types';

export default class Handler {
    private checkerFactory: ICheckerFactory;

    constructor(checkerFactory: ICheckerFactory) {
        this.checkerFactory = checkerFactory;
    }

    async checkMultiple(targets: CheckItem[]) {
        const promises: Promise<void>[] = [];

        for (const target of targets) {
            const checker = this.checkerFactory.get(target.PageUrl);

            if (checker) {
                promises.push(checker.check(target.PageUrl, target.BookingSize));
            }
        }

        await Promise.allSettled(promises);
    }
}