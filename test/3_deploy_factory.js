const QuantumGoldTokenFactory =
  artifacts.require('./QuantumGoldTokenFactory.sol')

module.exports = (deployer) => {
  deployer.deploy(QuantumGoldTokenFactory)
}
