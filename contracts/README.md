# Tixo Collection Smart Contract V1
Tixo Protocol is used to manage the creation of events, minting of tickets and the subsequent ownership of those tickets.

## Contract Details
The contract is named `TixoProtocolV1` and extends `ERC721URIStorage` and `Ownable` from OpenZeppelin. It uses `Counters` for managing unique IDs for events and tickets.

### Key Features

#### Event Creation
- Events can be created by any user.
- Each event has a unique identifier, a ticket price, a maximum ticket limit, and an owner (the creator of the event).
- When an event is created, it emits an `EventCreated` event.

#### Ticket Minting
- Tickets can be minted (created) by any user by paying the event's ticket price.
- Each ticket has a unique identifier, which is derived from the event ID and the ticket ID within that event.
- When a ticket is minted, it emits a `TicketMinted` event and the value is transferred to the event's owner.
- Tickets are represented as non-fungible tokens (NFTs), ensuring verifiable ownership and uniqueness.

#### Collection URI Management
- The contract owner (deployer) can update the base URI for the collection.
- Whenever the URI is updated, a `CollectionURIUpdated` event is emitted.

### Accessible Information
- Any user can query the latest event ID, last ticket ID for a specific event, ticket price for a specific event, and the owner of a specific event.

## How To Use
To use this smart contract, you'll need to deploy it on an EVM network (like the mainnet, Theta Network, etc.) using a deployment tool like Truffle, Hardhat, or Remix.

This includes creating events, minting tickets by paying the specified ticket price, and querying information about events and tickets.

## Concluding Note
This smart contract allows for the secure and transparent creation and management of events and their associated tickets.

Please refer to the source code comments for a more in-depth understanding of the workings of the smart contract.
