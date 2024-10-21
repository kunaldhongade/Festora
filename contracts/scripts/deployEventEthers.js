// Import the libraries and load the environment variables.
const { SDK, Auth, TEMPLATES, Metadata } = require("@infura/sdk");
require("dotenv").config();
const fs = require("fs");
const { ethers } = require("ethers");
const ERC1155Mintable = require("./ERC1155Mintable.json");

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

  const wallet = new ethers.Wallet(
    process.env.WALLET_PRIVATE_KEY || "",
    provider
  );
  try {
    const contractFactory = new ethers.ContractFactory(
      ERC1155Mintable.abi,
      ERC1155Mintable.bytecode,
      wallet
    );

    const contract = await contractFactory.deploy(
      "ipfs://QmfSQg9ZysC4PkNokxBFy6BAFtBxLwVCKQWEBXHnt5G3Er",
      "ipfs://QmfSQg9ZysC4PkNokxBFy6BAFtBxLwVCKQWEBXHnt5G3Er",
      [1, 2, 3, 4, 5, 6]
    );
    console.log(`Contract address is: ${contract.contractAddress}`);
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
