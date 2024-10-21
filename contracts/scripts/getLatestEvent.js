const hre = require("hardhat");

async function main() {
  try {
    const TixoProtocolV1 = await hre.ethers.getContractFactory(
      "TixoProtocolV1"
    );

    const tixo = await TixoProtocolV1.attach(
      process.env.TIXO_ADDRESS // deployed contract address
    );

    console.log("TixoProtocolV1 attached to:", tixo.address);

    console.log("Fetching last event ID...");

    const txn = await tixo.getLastEventId();
    console.log("last event Id: ", txn);
  } catch (err) {
    console.log(err.message);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
