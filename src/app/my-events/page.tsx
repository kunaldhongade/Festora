"use client";

import { EventCard } from "@/components/event-card";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import type { EventStruct } from "@/lib/types";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function MyEventsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [events, setEvents] = useState<EventStruct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEvents = async () => {
    if (!address) return;

    try {
      const ownerLowercase = address.toLowerCase();
      console.log("Fetching events for owner:", ownerLowercase);

      const res = await fetch("/api/events?owner=" + ownerLowercase);
      const data = await res.json();

      console.log("Received events data:", data);

      if (res.ok) {
        setEvents(data);
        setError(null);
      } else {
        throw new Error(data.error || "Failed to fetch events");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchMyEvents();
    } else {
      setEvents([]);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting event with id:", id);
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
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
                {error}
              </h2>
              <Button onClick={fetchMyEvents}>Retry</Button>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isOwner={true}
                  onDelete={() => handleDelete(event._id)}
                  onPayout={() => {}}
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
