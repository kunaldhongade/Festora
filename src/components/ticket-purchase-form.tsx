"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEventContract } from "@/hooks/use-event-contract";
import { useToast } from "@/hooks/use-toast";
import type { EventStruct, TicketType } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface TicketPurchaseFormProps {
  event: EventStruct;
  userTickets: TicketType[];
  onPurchase: () => void;
}

export function TicketPurchaseForm({
  event,
  userTickets,
  onPurchase,
}: TicketPurchaseFormProps) {
  const { buyTickets, toWei } = useEventContract();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasAvailableSeats = event.seats < event.capacity;
  const eventEnded = Date.now() > event.endsAt;
  const totalCost = event.ticketCost * quantity;

  const handlePurchase = async () => {
    try {
      setIsSubmitting(true);
      await buyTickets(event.id, quantity, totalCost);
      onPurchase();

      toast({
        title: "Success!",
        description: `You purchased ${quantity} ticket${
          quantity > 1 ? "s" : ""
        }`,
      });
    } catch (error: any) {
      console.error("Error purchasing tickets:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to purchase tickets",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (eventEnded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Ended</CardTitle>
          <CardDescription>
            This event has already ended and tickets are no longer available for
            purchase.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!hasAvailableSeats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sold Out</CardTitle>
          <CardDescription>
            All tickets for this event have been sold.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Tickets</CardTitle>
        <CardDescription>
          {event.capacity - event.seats} tickets remaining
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Number of Tickets</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={event.capacity - event.seats}
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
            />
          </div>

          <div className="pt-2">
            <div className="flex justify-between py-2 border-t">
              <span>Price per ticket:</span>
              <span>{event.ticketCost} ETH</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total:</span>
              <span>{totalCost.toFixed(6)} ETH</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handlePurchase}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Buy Ticket${quantity > 1 ? "s" : ""}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
