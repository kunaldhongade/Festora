import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "./navbar";

export function Hero() {
  return (
    <div className="relative">
      <Navbar />
      <div className="relative bg-gradient-to-b from-background to-background/50">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Decentralized Event Management
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
            Create, manage, and attend events with blockchain-powered ticketing
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/create">Create Event</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/my-events">My Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
