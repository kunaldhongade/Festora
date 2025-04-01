"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEventContract } from "@/hooks/use-event-contract";
import { useToast } from "@/hooks/use-toast";
import type { EventStruct } from "@/lib/types";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EventActionsProps {
  event: EventStruct;
}

export function EventActions({ event }: EventActionsProps) {
  const router = useRouter();
  const { deleteEvent, payoutEvent } = useEventContract();
  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  const eventEnded = Date.now() > event.endsAt;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEvent(event.id);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      router.push("/my-events");
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePayout = async () => {
    try {
      setIsProcessingPayout(true);
      await payoutEvent(event.id);
      toast({
        title: "Success",
        description: "Payout processed successfully",
      });
      router.refresh();
    } catch (error: any) {
      console.error("Error processing payout:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process payout",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayout(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Manage Event</h3>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push(`/edit/${event.id}`)}
      >
        Edit Event
      </Button>

      {eventEnded && !event.paidOut && (
        <Button
          className="w-full"
          onClick={handlePayout}
          disabled={isProcessingPayout}
        >
          {isProcessingPayout ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payout...
            </>
          ) : (
            "Process Payout"
          )}
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <Trash className="h-4 w-4 mr-2" />
            Delete Event
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete your event and refund all ticket
              purchases. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
