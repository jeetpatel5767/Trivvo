import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying TrivvoHuntEscrow with account:", deployer.address);

    const TrivvoHuntEscrow = await ethers.getContractFactory("TrivvoHuntEscrow");
    const escrow = await TrivvoHuntEscrow.deploy(deployer.address);
    await escrow.waitForDeployment();

    const address = await escrow.getAddress();
    console.log("TrivvoHuntEscrow deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
