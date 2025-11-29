export interface IAvailabilityChecker {
    check(pageUrl: string, bookingSize: number): Promise<void>
}

export interface ICheckerFactory {
    get(url: string): IAvailabilityChecker | undefined
}