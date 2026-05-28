"use client";

import { motion } from "framer-motion";
import { useEvents } from "../hooks/useEvent";

export default function TrendingSection() {
  // Get events from API, sorted by most bookings (trending)
  const { data: events, isLoading, error } = useEvents();

  // Get the first event as "trending" (or the one with most bookings)
  const trendingEvent = events && events.length > 0
    ? events.reduce((prev, current) =>
      (current._count?.bookings || 0) > (prev._count?.bookings || 0) ? current : prev
    )
    : null;

  if (isLoading) {
    return (
      <section className="max-w-5xl mx-auto mt-12 w-full">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-1">
          <span role="img" aria-label="fire">🔥</span> Trending Now
        </h2>
        <p className="text-[#6b6b8a] mb-4 text-sm">Don&apos;t miss these popular events</p>
        <div className="flex flex-col md:flex-row gap-6 animate-pulse">
          <div className="rounded-xl bg-gray-200 w-full md:w-2/5 h-64 md:h-56"></div>
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col justify-between space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !trendingEvent) {
    return (
      <section className="max-w-5xl mx-auto mt-12 w-full">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-1">
          <span role="img" aria-label="fire">🔥</span> Trending Now
        </h2>
        <p className="text-[#6b6b8a] mb-4 text-sm">Don&apos;t miss these popular events</p>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="rounded-xl bg-gray-200 w-full md:w-2/5 h-64 md:h-56"></div>
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
            <p className="text-gray-500">No trending events available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto mt-12 w-full">
      <h2 className="flex items-center gap-2 text-xl font-bold mb-1">
        <span role="img" aria-label="fire">🔥</span> Trending Now
      </h2>
      <p className="text-[#6b6b8a] mb-4 text-sm">Don&apos;t miss these popular events</p>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`/event-${trendingEvent.id}.jpg`}
          alt={trendingEvent.title}
          className="rounded-xl object-cover w-full md:w-2/5 h-64 md:h-56 bg-gray-200"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-event.jpg";
          }}
        />
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-[#f3f0ff] text-[#7b61ff] px-3 py-1 rounded-full text-xs font-semibold mb-2">
              {trendingEvent.location.includes(',') ? trendingEvent.location.split(',')[1]?.trim() : 'Event'}
            </span>
            <h3 className="text-2xl font-bold mb-2">{trendingEvent.title}</h3>
            <p className="text-[#6b6b8a] mb-4">{trendingEvent.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#7b61ff] font-semibold">${trendingEvent.price}</span>
            {trendingEvent.maxCapacity <= (trendingEvent._count?.bookings || 0) && (
              <span className="bg-[#ffeaea] text-[#ff4d4f] px-3 py-1 rounded-full text-xs font-semibold">Sold Out</span>
            )}
            <span className="text-[#6b6b8a] text-sm">
              {new Date(trendingEvent.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })} &middot; {trendingEvent.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
