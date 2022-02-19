const main = async () => {
	const [owner, randomPerson] = await hre.ethers.getSigners();
	const domainContractFactory = await hre.ethers.getContractFactory('Domains');
	const domainContract = await domainContractFactory.deploy('anon');
	await domainContract.deployed();
	console.log('Contract deployed to:', domainContract.address);
	console.log('Contract deployed by:', owner.address);

	let txn = await domainContract.register('Doom', {
		value: hre.ethers.utils.parseEther('100'),
	});
	await txn.wait();
	const domainAddress = await domainContract.getAddress('Doom');
	console.log('Owner of domain doom:', domainAddress);
	try {
		let txn = await domainContract.register('Doom', {
			value: hre.ethers.utils.parseEther('100'),
		});
		await txn.wait();
	} catch (error) {
		console.log(error);
	}
	try {
		let txn = await domainContract.register('Doooooooooom', {
			value: hre.ethers.utils.parseEther('0.005'),
		});
		await txn.wait();
	} catch (error) {
		console.log(error);
	}
	try {
		let txn = await domainContract.setRecord('Doooooooooom', 'test');
		await txn.wait();
	} catch (error) {
		console.log(error);
	}

	const balance = await hre.ethers.provider.getBalance(domainContract.address);
	console.log('Contract balance:', hre.ethers.utils.formatEther(balance));
	try {
		txn = await domainContract.connect(superCoder).withdraw();
		await txn.wait();
	} catch (error) {
		console.log('Could not rob contract');
	}

	let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
	console.log(
		'Balance of owner before withdrawal:',
		hre.ethers.utils.formatEther(ownerBalance)
	);

	txn = await domainContract.connect(owner).withdraw();
	await txn.wait();

	const contractBalance = await hre.ethers.provider.getBalance(
		domainContract.address
	);
	ownerBalance = await hre.ethers.provider.getBalance(owner.address);

	console.log(
		'Contract balance after withdrawal:',
		hre.ethers.utils.formatEther(contractBalance)
	);
	console.log(
		'Balance of owner after withdrawal:',
		hre.ethers.utils.formatEther(ownerBalance)
	);
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
