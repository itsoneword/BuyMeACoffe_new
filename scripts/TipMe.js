const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // We get the contract to deploy.
  const TipMeHoney = await hre.ethers.getContractFactory("TipMeHoney");
  const tipMeHoney = await TipMeHoney.deploy();

  // Deploy the contract.
  await tipMeHoney.deployed();
  console.log("TipMeHoney deployed to:", tipMeHoney.address);

  // Check balances before the coffee purchase.
  const addresses = [owner.address, tipper.address, tipMeHoney.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Tip me, Hoooneeeey!!!!
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await tipMeHoney.connect(tipper).tipMe("HornyGoat", "You're the best!", tip);
  await tipMeHoney.connect(tipper2).tipMe("VittoBigCock", "Amazing boobs", tip);
  await tipMeHoney.connect(tipper3).tipMe("KayMayBeaGuy", "Iam the reason", tip);

  // Check balances after the coffee purchase.
  console.log("== Honey was tipped =) ==");
  await printBalances(addresses);

  // Withdraw.
  await tipMeHoney.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await tipMeHoney.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });