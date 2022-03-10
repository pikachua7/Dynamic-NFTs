const Token = artifacts.require("Token");
const Items = artifacts.require("Items");

module.exports = async function(deployer){
	await deployer.deploy(Token);
	const token = await Token.deployed();

	await deployer.deploy(Items, token.address);
	const items = await Items.deployed();

	await token.createTokens(items.address);
};