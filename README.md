# **Festora: Where Events Come Alive! 🎉**

## 🎉 Redefining Event Management with Blockchain

Welcome to **Festora**, the next-generation event management platform powered by the **Polygon Blockchain**. Say goodbye to fraud, exorbitant fees, and outdated ticketing systems. With Festora, organizers and attendees experience seamless NFT ticketing, transparent transactions, and unforgettable moments.

## 🚧 **The Problem with Traditional Event Management**

In today’s event space, both attendees and organizers face several challenges:

- **Fraud & Scalping**: Fake tickets and exploitative resale markets harm fan experiences.
- **Opaque Systems**: Hidden fees and black-box ownership models reduce value.
- **High Costs**: Centralized platforms charge exorbitant fees.
- **Limited Control**: Organizers lack ownership of their audience and event data.

## 💡 **What is Festora?**

**Festora** is a decentralized platform built to revolutionize event management. By leveraging the **Polygon blockchain**, Festora brings transparency, security, and ease to organizing and attending events. Whether it’s a private meetup or a grand concert, Festora offers NFT-based tickets, token-gated access, and seamless payment options—empowering organizers and elevating attendee experiences.

## ✨ **Features of Festora**

- **NFT-Based Ticketing 🎟️**: Verifiable and tradeable tickets that eliminate fraud.
- **Gas-Free Transactions ⛽**: Organizers cover gas fees, making transactions smooth for users.
- **Soulbound Tokens 🎖️**: Issue non-transferable proof of attendance for lasting memories.
- **Multi-Payment Methods 💳**: Accept both crypto and fiat payments with Stripe integration.
- **Blacklist Management 🚫**: Ensure event security by controlling access to organizers and attendees.
- **Customizable Event Pages 📄**: Design branded pages tailored to your event.
- **Token-Gated Access 🔑**: Create exclusive events accessible only with community tokens.
- **Real-Time Analytics 📊**: Track ticket sales and attendance in an intuitive dashboard.

## 🛠️ **How We Built It**

- **Frontend**: ReactJS, RainbowKit, Wagmi, Chakra UI
- **Backend**: Node.js, Express.js, IPFS (for decentralized file storage)
- **Smart Contracts**: Solidity, deployed on Polygon Blockchain
- **Payments**: Crypto payments via Polygon, fiat via Stripe API

---

## 🚀 **What’s Next for Festora?**

- **Mobile App 📱**: Develop a React Native mobile app for easier event access.
- **Advanced Analytics**: Provide deep insights into event performance and attendee behavior.
- **Seating Selection 🪑**: Interactive seat selection for large-scale events.
- **Tiered Ticketing**: Introduce VIP and General Admission options.
- **Community Tokens 💠**: Add ERC-20 token support for token-based payments.
- **Marketing & Partnerships 🤝**: Collaborate with event organizers to launch beta testing.

## 🌐 **The Market Opportunity**

The global event ticketing market is expected to reach **$68 billion by 2025**. Festora is at the forefront of innovation, providing a transparent and secure solution that ensures fair value, eliminates fraud, and maximizes convenience. With blockchain technology, Festora offers a trustless, seamless ecosystem where fans buy tickets directly, without intermediaries.

## Key Features

- `createEvent`: Allows a user to create a new event.
- `updateEvent`: Allows the event owner to update the details of an existing event.
- `deleteEvent`: Allows the event owner or contract owner to delete an event.
- `getEvents`: Returns all existing events.
- `getMyEvents`: Returns all events created by the caller.
- `getSingleEvent`: Returns a single event by its ID.
- `buyTickets`: Allows a user to buy tickets for an event.
- `getTickets`: Returns all tickets for a specific event.
- `refundTickets`: Refunds all tickets for a specific event.
- `payout`: Allows the event owner or contract owner to payout after an event.
- `mintTickets`: Mints NFT tickets for an event.

## Running the Application

Supply the following keys in your `.env` variable:

```sh
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_ALCHEMY_ID=<YOUR_ALCHEMY_PROJECT_ID>
NEXT_PUBLIC_PROJECT_ID=<WALLET_CONNECT_PROJECT_ID>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=somereallysecretsecret
```

`YOUR_ALCHEMY_PROJECT_ID`: [Get Key Here](https://dashboard.alchemy.com/)
`WALLET_CONNECT_PROJECT_ID`: [Get Key Here](https://cloud.walletconnect.com/sign-in)

Follow these steps to run the application:

1. Install the package modules by running the command: `yarn install`
2. Start the Hardhat server: `yarn blockchain`
3. Run the contract deployment script: `yarn deploy`
4. Run the contract seeding script: `yarn seed`
5. Spin up the Next.js development server: `yarn dev`

Now, your application should be up and running.

## 📚 Key Technologies

- 🌐 Next.js: A React framework for building server-side rendered and static websites.
- 📘 TypeScript: A statically typed superset of JavaScript.
- 📦 Hardhat: A development environment for Ethereum smart contracts.
- 🌐 EthersJs: A library for interacting with Ethereum and Ethereum-like blockchains.
- 📚 Redux-Toolkit: A library for managing application state.
- 🎨 Tailwind CSS: A utility-first CSS framework.
- 🌈 @rainbow-me/rainbowkit-siwe-next-auth: A library for authentication in Ethereum dApps.
- 📝 React-Toastify: A library for adding toast notifications to your React application.
- 📜 Swiper: A modern mobile touch slider.
- 📚 Wagmi: A library for building Ethereum dApps.

## Useful links

- 🏠 [Website](https://dappmentors.org/)
- ⚽ [Metamask](https://metamask.io/)
- 💡 [Hardhat](https://hardhat.org/)
- 📈 [Alchemy](https://dashboard.alchemy.com/)
- 🔥 [NextJs](https://nextjs.org/)
- 🎅 [TypeScript](https://www.typescriptlang.org/)
- 🐻 [Solidity](https://soliditylang.org/)
- 👀 [EthersJs](https://docs.ethers.io/v5/)
