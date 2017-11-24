
// var bip39 = require("bip39");
// var hdkey = require('ethereumjs-wallet/hdkey');
// var ProviderEngine = require("web3-provider-engine");
// var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
// var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
// var Web3 = require("web3");
//
// // Get our mnemonic and create an hdwallet
// var mnemonic = "couch solve unique spirit wine fine occur rhythm foot feature glory alex";
// var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
//
// // Get the first account using the standard hd path.
// var wallet_hdpath = "m/44'/60'/0'/0/";
// var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
// var address = "0x" + wallet.getAddress().toString("hex");
//
// var providerUrl = "https://testnet.infura.io";
// var engine = new ProviderEngine();
// engine.addProvider(new WalletSubprovider(wallet, {}));
// engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
// engine.start(); // Required by the provider engine.

module.exports = {
  networks: {
    ropsten: {
      network_id: 3,    // Official ropsten network id
      host: '128.199.120.45',
      port: 8545,
      gas: 4712388,
      gasPirce: 200000000000,
      from: '0xe0a46b5ea4c6e6e1349c0c0e62050410054f9f27'
    },
    development: {
      network_id: '*',
      host: 'localhost',
      port: 8545

    }
  },
  rpc: {
    // Use the default host and port when not using ropsten
    host: "localhost",
    port: 8545

  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
