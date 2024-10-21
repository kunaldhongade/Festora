const hre = require("hardhat");

async function main() {
  const TixoProtocolV1 = await hre.ethers.getContractFactory("TixoProtocolV1");
  const tixoProtocolV1 = await TixoProtocolV1.deploy();

  console.log("deploying...");

  await tixoProtocolV1.deployed();

  console.log(`Deployed successfully at: ${tixoProtocolV1.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  console.log(error.message);
  process.exitCode = 1;
});
