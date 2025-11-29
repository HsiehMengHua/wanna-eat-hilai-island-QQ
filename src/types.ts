export interface CheckItem {
    PageUrl: string;
    BookingSize: number
}

export type BookingStatus = 'booking-off' | 'full' | 'closed' | 'open';

export interface BookingCapacityDetails {
    times: Record<string, number[]>; // time slot -> available party sizes
    dinerTime: number;
    maxBookingSize: number;
    minBookingSize: number;
    status: BookingStatus;
}

export interface BookingCapacityResponse {
    default: Record<string, BookingCapacityDetails>; // date -> availability
}

export interface DayAvailability {
    date: string
    times: string[]
}