import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { Web3Storage } from "web3.storage";
import { MongoClient, ServerApiVersion } from "mongodb";
import Stripe from "stripe";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8888;

const WEB3_STORAGE_API_KEY = process.env.WEB3_STORAGE_API_KEY ?? "";

const client = new Web3Storage({
  token: WEB3_STORAGE_API_KEY,
  endpoint: new URL("https://api.web3.storage"),
});

const mongoClient = new MongoClient(process.env.MONGO_URI ?? "", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

type Attendee = {
  ticketId: string;
  status: "used" | "unused";
};

type Event = {
  eventName: string;
  description: string;
  hostName: string;
  hostId: string;
  location: string;
  date: string;
  time: string;
  maxTickets: number;
  costPerTicket: number;
  tokenAddress: string;
  attendees: Record<string, Attendee>;
  creationTxn: any;
  eventId: string;
};

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/event/id/:id", async (req: Request, res: Response) => {
  try {
    await mongoClient.connect();

    const eventsCollection = await mongoClient
      .db("tixo-fantom")
      .collection("events");

    const { id } = req.params;

    const event = await eventsCollection.findOne({ _id: id as any });

    res.status(200).send({ message: "Event fetched successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Event fetching failed" });
  }
});

app.get("/event/address/:address", async (req: Request, res: Response) => {
  try {
    await mongoClient.connect();

    const eventsCollection = await mongoClient
      .db("tixo-fantom")
      .collection("events");

    const { address } = req.params;

    console.log("fetch requests for ", address);

    const events = await eventsCollection
      .find({ [`attendees.${address}`]: { $exists: true } })
      .toArray();

    console.log("fetched events: ", events);

    res.status(200).send({ message: "Events fetched successfully", events });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Events fetching failed" });
  }
});

app.post("/createEvent", async (req: Request, res: Response) => {
  try {
    await mongoClient.connect();

    const eventsCollection = mongoClient.db("tixo-fantom").collection("events");

    const newEvent: Event = req.body;

    const event = {
      _id: newEvent.eventId,
      ...newEvent,
    };

    await eventsCollection.insertOne(event as any);

    res.status(200).send({
      message: "Event created successfully",
      eventId: newEvent.eventId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Event creation failed" });
  }
});

app.put("/updateEvent/:id", async (req: Request, res: Response) => {
  try {
    await mongoClient.connect();

    const eventsCollection = mongoClient.db("tixo-fantom").collection("events");

    const { id } = req.params;
    const eventUpdate = req.body;

    console.log("EVENT UPDATE: ", eventUpdate);

    const result = await eventsCollection.updateOne(
      { _id: id as any },
      { $set: eventUpdate }
    );

    if (result.matchedCount === 0) {
      res.status(404).send({ message: "No event with that ID was found." });
    } else {
      res.status(200).send({ message: "Event updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Event update failed" });
  }
});

app.post("/validateTicket", async (req: Request, res: Response) => {
  try {
    await mongoClient.connect();

    const eventsCollection = mongoClient.db("tixo-fantom").collection("events");

    const { eventId, ticketId, address } = req.body;

    console.log("event id, ticket id received: ", eventId, ticketId);

    const event: any = await eventsCollection.findOne({ _id: eventId as any });

    if (event.attendees[address].status === "used") {
      res.status(500).send({ message: "Ticket already used" });
      return;
    }

    const newEvent = JSON.parse(JSON.stringify(event));
    newEvent.attendees[address].status = "used";

    const result = await eventsCollection.updateOne(
      { _id: eventId as any },
      { $set: newEvent }
    );

    if (result.matchedCount === 0) {
      res
        .status(404)
        .send({ message: "No event with that ID and ticketId was found." });
    } else {
      res.status(200).send({ message: "Ticket validated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Ticket validation failed" });
  }
});

const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
  apiVersion: "2022-11-15",
});

app.post("/payment", cors(), async (req, res) => {
  let { amount, id } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Tixo is the next-gen on-chain ticketing platform.",
      payment_method: id,
      confirm: true,
    });

    console.log("Payment", payment);
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  const { success_url, cancel_url } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "BLACK & WHITE",
          },
          unit_amount: 100, // price in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url,
    cancel_url,
  });

  res.json({ id: session.id });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
