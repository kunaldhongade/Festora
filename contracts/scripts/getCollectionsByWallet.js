// Import the libraries and load the environment variables.
const { SDK, Auth, TEMPLATES, Metadata } = require("@infura/sdk");
require("dotenv").config();

// Create Auth object
const auth = new Auth({
  projectId: process.env.INFURA_API_KEY,
  secretId: process.env.INFURA_API_KEY_SECRET,
  privateKey: process.env.WALLET_PRIVATE_KEY,
  chainId: 80001,
});

// Instantiate SDK
const sdk = new SDK(auth);
const getCollectionsByWallet = async (walletAddress) => {
  const result = await sdk.api.getCollectionsByWallet({
    walletAddress: walletAddress,
  });
  console.log("collections:", result);
};

(async () => {
  try {
    await getCollectionsByWallet("0xb149DDF60ad41eAc5805015cDf8fF7B5b1c80823");
  } catch (error) {
    console.log(error);
  }
})();
