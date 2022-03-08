const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "tuna practice series pool interest reward pink genre annual eagle hawk dirt".toString().trim();

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    // truffle migrate --network matic
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 50000,
      networkCheckTimeout: 10000000,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000,
    },
    // truffle migrate --network kovan
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/84516a8d18fe4958bd33f09a8b2daad9`),
      network_id: 42,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 10000,
    },
    // truffle migrate --network rinkeby
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/<key>`),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 20000
  },
  contracts_build_directory: './src/abis/',

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",    // Fetch exact version from solc-bin (default: truffle's version)
                           // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "byzantium"
      }
    },
  },
};
