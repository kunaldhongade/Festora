"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEventContract } from "@/hooks/use-event-contract";
import { useToast } from "@/hooks/use-toast";
import type { EventStruct } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  ticketCost: z.string().min(1, "Ticket cost is required"),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().min(1, "End date is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  event?: EventStruct;
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export function EventForm({
  event,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: EventFormProps) {
  const { createEvent, updateEvent } = useEventContract();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description,
          imageUrl: event.imageUrl,
          capacity: event.capacity,
          ticketCost: event.ticketCost.toString(),
          startsAt: new Date(event.startsAt).toISOString().slice(0, 16),
          endsAt: new Date(event.endsAt).toISOString().slice(0, 16),
        }
      : {
          title: "",
          description: "",
          imageUrl: "",
          capacity: 100,
          ticketCost: "0.01",
          startsAt: "",
          endsAt: "",
        },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);

      const ticketCost = Number(values.ticketCost);
      const startsAtTimestamp = new Date(values.startsAt).getTime();
      const endsAtTimestamp = new Date(values.endsAt).getTime();

      if (event) {
        // Update existing event
        await updateEvent({
          id: event.id,
          title: values.title,
          description: values.description,
          imageUrl: values.imageUrl,
          capacity: values.capacity,
          ticketCost,
          startsAt: startsAtTimestamp,
          endsAt: endsAtTimestamp,
        });
      } else {
        // Create new event
        await createEvent({
          title: values.title,
          description: values.description,
          imageUrl: values.imageUrl,
          capacity: values.capacity,
          ticketCost,
          startsAt: startsAtTimestamp,
          endsAt: endsAtTimestamp,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleImageChange(e);
                      }}
                    />
                  </FormControl>

                  {/* Add image preview here */}
                  {imagePreview && (
                    <div className="mt-2 aspect-video relative rounded-md overflow-hidden border">
                      <Image
                        src={imagePreview}
                        alt="Event preview"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                        <span className="text-sm text-white/80">
                          Live Preview
                        </span>
                      </div>
                    </div>
                  )}

                  <FormDescription>
                    Provide a URL to an image for your event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of tickets available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticketCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Cost (ETH)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        min="0.0000001"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Cost per ticket in ETH</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {event ? "Updating Event..." : "Creating Event..."}
                </>
              ) : event ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
