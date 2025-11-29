import { CheckItem } from '../types';

export interface IAvailabilityChecker {
    check(target: CheckItem): Promise<void>
}

export interface ICheckerFactory {
    get(url: string): IAvailabilityChecker | undefined
}