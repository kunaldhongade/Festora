require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const { PRIVATE_KEY, EXPLORER_API_KEY, TIXO_ADDRESS, FTMSCAN_API_KEY } =
  process.env;

task("etherscan-verify", "Verifies on etherscan", async (taskArgs, hre) => {
  console.log("Verifying contract on etherscan...");
  await hre.run("verify:verify", {
    address: "0x98410A5f20dFF3D35711ddE52a589dcc17285375",
    network: "opera",
  });
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "fantom",
  networks: {
    fantom: {
      url: "https://rpc.ftm.tools",
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 250,
    },
    ftmTestnet: {
      url: "https://rpc.testnet.fantom.network/",
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 4002,
    },
  },
  etherscan: {
    apiKey: {
      opera: FTMSCAN_API_KEY,
      ftmTestnet: FTMSCAN_API_KEY,
    },
  },
};
