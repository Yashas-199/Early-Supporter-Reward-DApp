const EarlySupport = artifacts.require("EarlySupport");

module.exports = function (deployer) {
  deployer.deploy(EarlySupport, { gas: 3000000 });
};
