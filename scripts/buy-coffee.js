// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// Return the ether balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance:`, await getBalance(address));
    idx++;
  }
}

// Logs of the memos stored on chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`)
  }
}

async function main() {
	// Get Example Accounts
	const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

	// Get the contract to deploy & deploy
	const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
	const buyMeACoffee = await BuyMeACoffee.deploy();
	await buyMeACoffee.deployed();
	console.log('BuyMeACoffee deployed to ', buyMeACoffee.address);

	// Check balances before the coffee purchase
	const addresses = [owner.address, tipper.address, buyMeACoffee.address];
	console.log('== start ==');
	await printBalances(addresses);

	// Buy the owner a few coffees
	const tip = { value: hre.ethers.utils.parseEther('1') };
	await buyMeACoffee.connect(tipper).buyCoffee('Brad', 'Amazing person', tip);
	await buyMeACoffee
		.connect(tipper2)
		.buyCoffee('Chad', 'Among us is still cool', tip);
	await buyMeACoffee
		.connect(tipper3)
		.buyCoffee('Dad', 'You are doing great', tip);

	// Check balances after coffee purchase
	console.log('== Bought Coffee ==');
	await printBalances(addresses);

	// Withdraw funds
	await buyMeACoffee.connect(owner).withdrawTips();

	// Check balances after tip withdrawal
	console.log('== Tips Withdrawn ==');
	await printBalances(addresses);

	// Read all memos left for the owner
	console.log('== memos ==');
	const memos = await buyMeACoffee.getMemos();
  printMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
