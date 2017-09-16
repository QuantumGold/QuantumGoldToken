const QuantumGoldToken = artifacts.require('./QuantumGoldToken.sol')

module.exports = (deployer) => {
  deployer.deploy(QuantumGoldToken);
}
