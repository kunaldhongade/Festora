export type Attendee = {
  ticketId: string;
  status: "used" | "unused";
};

export type Event = {
  eventName: string;
  description: string;
  hostName: string;
  hostId: string;
  location: any;
  date: number;
  maxTickets: number;
  costPerTicket: number;
  tokenAddress: string;
  attendees: Record<string, Attendee>;
  creationTxn: any;
  eventId: string;
  bgImage: string;
};
