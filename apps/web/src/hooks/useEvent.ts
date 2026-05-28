import { useQuery } from "@tanstack/react-query";

export interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string;
    maxCapacity: number;
    price: number;
    lat?: number;
    lng?: number;
    organizerId: number;
    createdAt: string;
    updatedAt: string;
    organizer?: {
        id: number;
        name: string;
        email: string;
    };
    _count?: {
        bookings: number;
    };
}

interface EventSearchParams {
    search?: string;
    city?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}

export function useEvents(params: EventSearchParams = {}) {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.city) queryParams.append('city', params.city);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/events${queryString ? `?${queryString}` : ''}`;

    return useQuery({
        queryKey: ['events', params],
        queryFn: async (): Promise<Event[]> => {
            const token = localStorage.getItem('access_token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch events');
            }

            return response.json();
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}

// Example usage:
// const { data, isLoading, error } = useEvents({
//   search: 'tech',
//   city: 'San Francisco', 
//   dateFrom: '2024-01-01',
//   dateTo: '2024-12-31'
// });
