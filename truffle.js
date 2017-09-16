module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      //from: "0x7545e295e6850f9202930284c3324d954822b74f",
      //gas: "4712388",
      //gasPrice: "100000000000"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
