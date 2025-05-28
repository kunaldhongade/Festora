"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/navbar";
import { EventForm } from "@/components/event-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PaymentButton } from "@/components/payment-button";

export default function CreateEventPage() {
  const { isConnected, address } = useAccount(); // ✅ Grab address
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    toast({
      title: "Event Created!",
      description: "Your event has been created successfully",
    });
    router.push("/my-events");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <Button variant="outline" onClick={() => router.push("/")}>Back to Events</Button>
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              You need to connect your wallet to create an event
            </p>
          </div>
        ) : (
          <>
            {!formData ? (
              <EventForm
                onSubmit={(data) => {
                  console.log("Form data submitted:", data);
                  setFormData(data);
                }}
                isSubmitting={false}
                setIsSubmitting={() => {}}
              />
            ) : (
              <div className="text-center py-8">
                <PaymentButton
                  amount={100}
                  onSuccess={async (paymentId, orderId) => {
                    console.log("Payment success handler called:", paymentId, orderId);
                    setIsSubmitting(true);
                    try {
                      const res = await fetch("/api/events/create", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          eventData: {
                            ...formData,
                            owner: address?.toLowerCase(), 
                          },
                          paymentId,
                          orderId,
                        }),
                      });

                      const json = await res.json();
                      console.log("Event creation response:", json);
                      if (!res.ok || json.error) {
                        throw new Error(json.error || "Event creation failed");
                      }
                      handleSuccess();
                    } catch (err: any) {
                      console.error("Event creation error:", err);
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: err.message,
                      });
                      setIsSubmitting(false);
                    }
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
