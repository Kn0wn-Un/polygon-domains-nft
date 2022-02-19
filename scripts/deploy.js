const main = async () => {
	const domainContractFactory = await hre.ethers.getContractFactory('Domains');
	const domainContract = await domainContractFactory.deploy('anon');
	await domainContract.deployed();

	console.log('Contract deployed to:', domainContract.address);

	let txn = await domainContract.register('Kn0wnUn', {
		value: hre.ethers.utils.parseEther('0.05'),
	});
	await txn.wait();
	console.log('Minted domain anon.Kn0wnUn');

	txn = await domainContract.setRecord('Kn0wnUn', '>Be me Kn0wnUn');
	await txn.wait();
	console.log('Set record for anon.Kn0wnUn');

	const address = await domainContract.getAddress('Kn0wnUn');
	console.log('Owner of domain Kn0wnUn:', address);

	const balance = await hre.ethers.provider.getBalance(domainContract.address);
	console.log('Contract balance:', hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

runMain();
