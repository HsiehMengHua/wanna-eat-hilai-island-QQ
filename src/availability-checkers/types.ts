export interface IAvailabilityChecker {
    check(pageUrl: string, bookingSize: number): Promise<void>
}