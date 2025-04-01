"use client";

import contractData from "@/abi/DappEventX.json";
import type { EventParams, EventStruct, TicketStruct } from "@/lib/types";
import type { Hash } from "viem";
import {
  type BaseError,
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { toast } from "./use-toast";

const CONTRACT_ADDRESS = "0x760Bf932E3a8631d4c47Dac8CF8be968f574e0dc" as const;
const CONTRACT_ABI = contractData.abi;

export function useEventContract() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const publicClient = usePublicClient();

  // Utility functions with type safety
  const toWei = (num: number): bigint => BigInt(num * 1e18);
  const fromWei = (num: bigint): number => Number(num) / 1e18;

  const handleError = (error: unknown): never => {
    const err = error as BaseError;
    toast({
      title: "Error",
      variant: "destructive",
      description: err.shortMessage || err.message || "Transaction failed",
    });
    throw error;
  };

  // Read operations with proper type annotations
  const useEvents = () => {
    const { data, error, isLoading } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getEvents",
    });
    return {
      events: structuredEvent(Array.isArray(data) ? data : []),
      error,
      isLoading,
    };
  };

  const useMyEvents = () => {
    const { data, error, isLoading } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getMyEvents",
      account: address,
      query: { enabled: !!address },
    });
    return {
      myEvents: structuredEvent(Array.isArray(data) ? data : []),
      error,
      isLoading,
    };
  };

  const useEvent = (eventId: number) => {
    const { data, error, isLoading } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getSingleEvent",
      args: [BigInt(eventId)],
    });
    return {
      event: data ? structuredEvent([data])[0] : null,
      error,
      isLoading,
    };
  };

  const useEventTickets = (eventId: number) => {
    const { data, error, isLoading } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getTickets",
      args: [BigInt(eventId)],
    });
    return {
      tickets: structuredTicket(Array.isArray(data) ? data : []),
      error,
      isLoading,
    };
  };

  // Write operations with consistent error handling
  const executeContractWrite = async <T extends any[]>(
    functionName: string,
    args: T,
    value?: bigint
  ) => {
    if (!isConnected) throw new Error("Connect your wallet first");
    if (!publicClient) throw new Error("Public client not available");

    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName,
        args,
        ...(value && { value }),
      });

      if (typeof hash === "undefined") {
        throw new Error("Transaction hash is undefined");
      }

      return await publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      return handleError(error);
    }
  };

  const createEvent = async (event: Omit<EventParams, "id">) => {
    const receipt = await executeContractWrite("createEvent", [
      event.title,
      event.description,
      event.imageUrl,
      BigInt(event.capacity),
      toWei(Number(event.ticketCost)),
      BigInt(event.startsAt),
      BigInt(event.endsAt),
    ]);

    toast({ title: "Success", description: "Event created!" });
    return receipt;
  };

  const updateEvent = async (event: EventParams) => {
    const receipt = await executeContractWrite("updateEvent", [
      BigInt(event.id ?? 0),
      event.title,
      event.description,
      event.imageUrl,
      BigInt(event.capacity),
      toWei(Number(event.ticketCost)),
      BigInt(event.startsAt),
      BigInt(event.endsAt),
    ]);

    toast({ title: "Success", description: "Event updated!" });
    return receipt;
  };

  const deleteEvent = async (eventId: number) => {
    const receipt = await executeContractWrite("deleteEvent", [
      BigInt(eventId),
    ]);

    toast({ title: "Success", description: "Event deleted!" });
    return receipt;
  };

  const payoutEvent = async (eventId: number) => {
    const receipt = await executeContractWrite("payout", [BigInt(eventId)]);

    toast({ title: "Success", description: "Payout completed!" });
    return receipt;
  };

  const buyTickets = async (
    eventId: number,
    quantity: number,
    totalCost: number
  ) => {
    const receipt = await executeContractWrite(
      "buyTickets",
      [BigInt(eventId), BigInt(quantity)],
      toWei(totalCost)
    );

    toast({ title: "Success", description: "Tickets purchased!" });
    return receipt;
  };

  // Data transformers with type guards
  const structuredEvent = (data: unknown): EventStruct[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      id: Number(item.id),
      title: item.title,
      imageUrl: item.imageUrl,
      description: item.description,
      owner: item.owner,
      sales: Number(item.sales),
      ticketCost: fromWei(item.ticketCost),
      capacity: Number(item.capacity),
      seats: Number(item.seats),
      startsAt: Number(item.startsAt),
      endsAt: Number(item.endsAt),
      timestamp: Number(item.timestamp),
      deleted: item.deleted,
      paidOut: item.paidOut,
      refunded: item.refunded,
      minted: item.minted,
    }));
  };

  const structuredTicket = (data: unknown): TicketStruct[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      id: Number(item.id),
      eventId: Number(item.eventId),
      owner: item.owner,
      ticketCost: fromWei(item.ticketCost),
      timestamp: Number(item.timestamp),
      refunded: item.refunded,
      minted: item.minted,
    }));
  };

  return {
    useEvents,
    useMyEvents,
    useEvent,
    useEventTickets,
    createEvent,
    updateEvent,
    deleteEvent,
    payoutEvent,
    buyTickets,
    toWei,
    fromWei,
  };
}
