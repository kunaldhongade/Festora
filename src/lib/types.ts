export interface EventStruct {
  _id: string; // MongoDB document ID
  title: string;
  imageUrl: string;
  description: string;
  owner: string;
  sales: number;
  ticketCost: number;
  capacity: number;
  seats: number;
  startsAt: number;
  endsAt: number;
  timestamp: number;
  deleted: boolean;
  paidOut: boolean;
  refunded: boolean;
  minted: boolean;
}
