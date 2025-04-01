"use client";

import { EventCard } from "@/components/event-card";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useEventContract } from "@/hooks/use-event-contract";
import type { EventStruct } from "@/lib/types";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function MyEventsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { useMyEvents, deleteEvent, payoutEvent } = useEventContract();
  const { myEvents: events, isLoading, error } = useMyEvents();
  const [eventsList, setEvents] = useState<EventStruct[]>([]);

  useEffect(() => {
    setEvents(events);
  }, [events]);

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  const handlePayout = async (eventId: number) => {
    try {
      await payoutEvent(eventId);
    } catch (err) {
      console.error("Failed to process payout:", err);
    }
  };

  return (
    <div>
      <Navbar />
      {!isConnected ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">My Events</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your events
          </p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Events</h1>
            <Button onClick={() => router.push("/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold mb-2 text-destructive">
                {error?.message || "An error occurred"}
              </h2>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : eventsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsList.map((event: EventStruct) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isOwner={true}
                  onDelete={handleDelete}
                  onPayout={handlePayout}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold mb-2">No Events Found</h2>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t created any events yet
              </p>
              <Button onClick={() => router.push("/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
