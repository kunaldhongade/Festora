// Import the libraries and load the environment variables.
const { SDK, Auth, TEMPLATES, Metadata } = require("@infura/sdk");
require("dotenv").config();
const fs = require("fs");

// Create Auth object
const auth = new Auth({
  projectId: process.env.INFURA_API_KEY,
  secretId: process.env.INFURA_API_KEY_SECRET,
  privateKey: process.env.WALLET_PRIVATE_KEY,
  chainId: 80001,
  ipfs: {
    projectId: process.env.INFURA_IPFS_PROJECT_ID,
    apiKeySecret: process.env.INFURA_IPFS_PROJECT_SECRET,
  },
});
// Instantiate SDK
const sdk = new SDK(auth);

(async () => {
  try {
    // CREATE CONTRACT Metadata
    const collectionMetadata = Metadata.openSeaCollectionLevelStandard({
      name: "Fantom Hacker Community NFT",
      description: "Welcome to the Fantom Hacker Community NFT.",
      image: await sdk.storeFile({
        metadata:
          "https://bafybeia474bx6uqs35bza2gihbofwm6wxwnkqlrsmfdis7dszpvlhaocji.ipfs.w3s.link/641b125cd69c80355cae2d51_blog%20header.png",
      }),
      external_link: "https://myawesomewebsite.net",
    });

    console.log("collectionMetadata ----", collectionMetadata);

    const storeMetadata = await sdk.storeMetadata({
      metadata: collectionMetadata,
    });
    console.log("storeMetadata", storeMetadata);

    const newContract = await sdk.deploy({
      template: TEMPLATES.ERC1155Mintable,
      params: {
        contractURI: storeMetadata,
        baseURI: storeMetadata,
        ids: [0, 1, 2, 3, 4, 5, 6],
      },
    });
    console.log(`Contract address is: ${newContract.contractAddress}`);
  } catch (error) {
    fs.writeFileSync(
      "./error.json",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    console.log(error);
  }
})();

process.on("unhandledRejection", (error) => {
  fs.writeFileSync(
    "./error.json",
    JSON.stringify(error, Object.getOwnPropertyNames(error))
  );
  console.error("Unhandled promise rejection:", error);
});
