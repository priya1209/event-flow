"use client";

import { motion } from "framer-motion";
import { useEvents } from "../hooks/useEvent";

export default function UpcomingEventsSection() {
  // Get all events from API
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto mt-12 w-full pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <span className="text-[#6b6b8a] text-sm">Loading events...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-0 flex flex-col overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto mt-12 w-full pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <span className="text-[#6b6b8a] text-sm">Error loading events</span>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load events. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return (
      <section className="max-w-6xl mx-auto mt-12 w-full pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <span className="text-[#6b6b8a] text-sm">0 events found</span>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No events found. Check back later!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto mt-12 w-full pb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        <span className="text-[#6b6b8a] text-sm">{events.length} events found</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 32px 0 rgba(123,97,255,0.10)" }}
            className="bg-white rounded-xl shadow p-0 flex flex-col overflow-hidden"
          >
            <div className="relative">
              <img
                src={`/event-${event.id}.jpg`}
                alt={event.title}
                className="w-full h-40 object-cover bg-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-event.jpg";
                }}
              />
              <div className="absolute top-3 left-3 bg-[#f3f0ff] text-[#7b61ff] px-3 py-1 rounded-full text-xs font-bold">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
              </div>
              <div className="absolute top-3 right-3 bg-white/80 px-3 py-1 rounded-full text-xs font-bold">
                ${event.price}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <span className="inline-block bg-[#f3f0ff] text-[#7b61ff] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                {event.location.includes(',') ? event.location.split(',')[1]?.trim() : 'Event'}
              </span>
              <h3 className="text-lg font-bold mb-1">{event.title}</h3>
              <div className="flex items-center gap-2 text-xs text-[#6b6b8a] mt-auto">
                <span>{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>•</span>
                <span>{event.location}</span>
                <span>•</span>
                <span>{event._count?.bookings || 0} attending</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
