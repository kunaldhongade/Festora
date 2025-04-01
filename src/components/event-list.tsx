"use client";

import { useEventContract } from "@/hooks/use-event-contract";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { EventCard } from "./event-card";

export function EventList() {
  const { address } = useAccount();
  const { useEvents } = useEventContract();
  const { events, isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Error loading events</h2>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">No Events Found</h2>
        <p className="text-muted-foreground">
          There are no events available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isOwner={
            address && event.owner.toLowerCase() === address.toLowerCase()
          }
        />
      ))}
    </div>
  );
}
