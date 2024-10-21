const hre = require("hardhat");

async function main() {
  const FantomHackerNFT = await hre.ethers.getContractFactory(
    "FantomHackerNFT"
  );
  const nft = await FantomHackerNFT.deploy();

  console.log("deploying...");

  await nft.deployed();

  console.log(`Deployed successfully at: ${nft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  console.log(error.message);
  process.exitCode = 1;
});
