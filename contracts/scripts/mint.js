const hre = require("hardhat");

async function main() {
  try {
    const tokenFactory = await hre.ethers.getContractFactory("FantomHackerNFT");

    const token = await tokenFactory.attach(
      "0x14544B8C7a23Cd6A669ed9C591E2b9d378DFce92"
    );

    console.log("FantomHackerNFT attached to:", token.address);

    console.log("Minting...");

    const txn = await token.safeMint(
      "0xD47757f0707A0D8800e6DFb9354FAAE1c79Ac3A2",
      1,
      "https://bafybeidx6dbqqww5rjuuq5zuij6rspob7whff4k4libqjxj3d4q2csrxjq.ipfs.w3s.link/metadata.json"
    );
    await txn.wait();
    console.log("event created ", txn);
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
