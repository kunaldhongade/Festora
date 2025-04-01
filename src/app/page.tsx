import { EventList } from "@/components/event-list";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="lg:text-3xl md:text-2xl text-lg font-bold">
            Upcoming Events
          </h2>
        </div>
        <EventList />
      </div>
    </main>
  );
}
