import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EventStruct } from "@/lib/types";
import { formatDate, truncateText } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MoreVertical,
  Ticket,
  Trash,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: EventStruct;
  isOwner?: boolean;
  onDelete?: (eventId: number) => Promise<void>;
  onPayout?: (eventId: number) => Promise<void>;
}

export function EventCard({
  event,
  isOwner = false,
  onDelete,
  onPayout,
}: EventCardProps) {
  const hasAvailableSeats = event.seats < event.capacity;
  const eventEnded = Date.now() > event.endsAt;
  const canPayout = isOwner && !event.paidOut && eventEnded;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg ">
      <div className="relative h-48">
        <Image
          src={event.imageUrl || "/placeholder.svg?height=200&width=400"}
          alt={event.title}
          fill
          className={`object-cover transition-all duration-300 ${
            eventEnded ? "grayscale" : ""
          }`}
          priority={false}
        />
        {!isOwner && (
          <Badge
            className={`absolute top-2 left-2 ${
              eventEnded
                ? "bg-primary text-white grayscale"
                : hasAvailableSeats
                ? "bg-green-600 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {eventEnded
              ? "Event Ended"
              : hasAvailableSeats
              ? "Available Now"
              : "Sold Out"}
          </Badge>
        )}

        {isOwner && (
          <Badge className="absolute top-2 right-2 bg-primary">
            Your Event
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 whitespace-pre">
          {truncateText(event.description, 50)}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(event.startsAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.endsAt ? formatDate(event.endsAt) : "Ongoing"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {event.seats} / {event.capacity}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Ticket className="h-4 w-4 text-primary" />
            <span>{Number(event.ticketCost).toFixed(4)} ETH</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {isOwner ? (
          <div className="flex w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-3">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/events/${event.id}`} className="cursor-pointer">
                    <Wallet className="h-4 w-4 mr-2" />
                    Manage Event
                  </Link>
                </DropdownMenuItem>
                {canPayout && (
                  <DropdownMenuItem
                    onClick={() => onPayout?.(event.id)}
                    className="text-green-600"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Process Payout
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete?.(event.id)}
                  className="text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild className="flex-1">
              <Link href={`/events/${event.id}`}>Details</Link>
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full">
            <Link href={`/events/${event.id}`}>
              {hasAvailableSeats && !eventEnded
                ? "Buy Tickets"
                : "View Details"}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
