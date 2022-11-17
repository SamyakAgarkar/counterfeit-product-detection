const Counterfeit = artifacts.require('Counterfeit');

module.exports = async function (deployer) {
  await deployer.deploy(Counterfeit);
  const cf = await Counterfeit.deployed()

  // console.log(cf)
  cf.transferOwnership('0x98E4B74463F0a597f2C7c7aB25984dC302E04132')
    .then(response => {
      console.log(response);
    })
    .catch(error => console.log("Error1"))
  // cf.registerSeller('Anas','Owner').catch(error=>console.log("Error2"))
};
