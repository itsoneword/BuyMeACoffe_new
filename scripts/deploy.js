const hre = require("hardhat");

async function main() {

    // We get the contract to deploy.
    const TipMeHoney = await hre.ethers.getContractFactory("TipMeHoney");
    const tipMeHoney = await TipMeHoney.deploy();
    await tipMeHoney.deployed();
    console.log("TipMeHoney deployed to:", tipMeHoney.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });