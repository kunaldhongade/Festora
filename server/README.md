# Tixo API Server

This is a server application implemented with Node.js and Express.js for the Tixo Event platform, an on-chain ticketing system. The server application connects to a MongoDB database for storing event and attendee details, Web3.Storage for decentralized file storage, and Stripe for payment processing.

## Key Features

### Event Management
- Create an event with details like name, description, host name, location, date, time, max tickets, ticket price, token address, and creation transaction.
- Fetch an event by its unique identifier.
- Fetch all events associated with a specific attendee's address.
- Update an event's details.
- Validate an attendee's ticket for an event.

### Payment Processing
- Handle single payments using Stripe's Payment Intents API.
- Create Stripe checkout sessions.

## Technologies Used
- **Express.js**: Framework used for handling server routing.
- **MongoDB**: Database for storing event and attendee details.
- **Web3.Storage**: Decentralized storage solution.
- **Stripe**: Payment processing service.

## Setup and Configuration

This application uses dotenv for environment variable management. You will need to provide the following environment variables:

- `PORT`: Port number on which the server runs.
- `WEB3_STORAGE_API_KEY`: API key for Web3.Storage.
- `MONGO_URI`: Connection string for your MongoDB database.
- `STRIPE_SECRET`: Secret API key for Stripe.

These should be placed in a `.env` file at the root of your project.

## API Endpoints

Here are the main API endpoints the server provides:

- GET `/event/id/:id`: Fetches an event by its ID.
- GET `/event/address/:address`: Fetches all events associated with the attendee address.
- POST `/createEvent`: Creates a new event.
- PUT `/updateEvent/:id`: Updates an existing event.
- POST `/validateTicket`: Validates an attendee's ticket.
- POST `/payment`: Processes a payment.
- POST `/create-checkout-session`: Creates a Stripe checkout session.

## How To Use

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Provide necessary environment variables.
4. Run `npm start` to start the server.

## Concluding Note

This server application serves as the backend for the Tixo event platform, managing all interactions with the database, decentralized storage, and payment processing. It provides a robust and scalable foundation for the on-chain ticketing system.
