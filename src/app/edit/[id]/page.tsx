"use client";

import { EventForm } from "@/components/event-form";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useEventContract } from "@/hooks/use-event-contract";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function EditEventPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const router = useRouter();
  const { toast } = useToast();
  const { useEvent } = useEventContract();

  const { event, isLoading, error } = useEvent(eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Event updated successfully",
    });
    router.push(`/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <Button onClick={() => router.push("/")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
        <EventForm
          event={event}
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </div>
  );
}
