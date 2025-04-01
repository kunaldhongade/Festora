"use client";

import { EventActions } from "@/components/event-actions";
import { Navbar } from "@/components/navbar";
import { TicketPurchaseForm } from "@/components/ticket-purchase-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEventContract } from "@/hooks/use-event-contract";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Loader2, Ticket, Users } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function EventPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const router = useRouter();
  const { address } = useAccount();
  const { toast } = useToast();

  const { useEvent, useEventTickets } = useEventContract();
  const {
    event,
    isLoading: isEventLoading,
    error: eventError,
  } = useEvent(eventId);
  const {
    tickets,
    isLoading: areTicketsLoading,
    error: ticketsError,
  } = useEventTickets(eventId);

  const loading = isEventLoading || areTicketsLoading;

  useEffect(() => {
    if (eventError || ticketsError) {
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    }
  }, [eventError, ticketsError, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <Button onClick={() => router.push("/")}>Back to Events</Button>
      </div>
    );
  }

  const userTickets = address
    ? tickets.filter(
        (ticket) => ticket.owner.toLowerCase() === address.toLowerCase()
      )
    : [];
  const isOwner = address?.toLowerCase() === event.owner.toLowerCase();
  const hasAvailableSeats = event.seats < event.capacity;
  const eventEnded = Date.now() > event.endsAt;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push("/")}
        >
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
              <Image
                src={event.imageUrl || "/placeholder.svg?height=400&width=800"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {event.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{formatDate(event.startsAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>
                  {event.endsAt ? formatDate(event.endsAt) : "Ongoing"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>
                  {event.seats} / {event.capacity} seats
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                <span>{event.ticketCost.toFixed(4)} ETH</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">About this event</h2>
              <p className="text-gray-300">{event.description}</p>
            </div>
          </div>

          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                {isOwner ? (
                  <EventActions event={event} />
                ) : (
                  <TicketPurchaseForm
                    event={event}
                    userTickets={userTickets.map((ticket) => ({
                      ...ticket,
                      ticketCost: BigInt(Math.round(ticket.ticketCost * 1e18)),
                    }))}
                    onPurchase={() => {
                      toast({
                        title: "Success!",
                        description: "Tickets purchased successfully",
                      });
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {userTickets.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Your Tickets</h3>
                  <div className="space-y-3">
                    {userTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-3 border border-border rounded-md flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">Ticket #{ticket.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {ticket.ticketCost.toFixed(4)} ETH
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs ${
                            ticket.minted
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {ticket.minted ? "Minted" : "Pending"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
