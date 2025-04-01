"use client";

import { EventForm } from "@/components/event-form";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function CreateEventPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    toast({
      title: "Event Created!",
      description: "Your event has been created successfully",
    });
    router.push("/");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Events
          </Button>
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              You need to connect your wallet to create an event
            </p>
          </div>
        ) : (
          <EventForm
            onSuccess={handleSuccess}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        )}
      </div>
    </div>
  );
}
