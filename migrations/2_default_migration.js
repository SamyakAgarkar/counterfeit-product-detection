const Counterfeit = artifacts.require('Counterfeit');

module.exports = async function (deployer) {
  await deployer.deploy(Counterfeit);
  const cf = await Counterfeit.deployed()

  // console.log(cf)
  cf.transferOwnership('0x6Bf4a835c7c1e0bBD7A22d1FF305bA02d5b7167D')
    .then(response => {
      console.log(response);
    })
    .catch(error => console.log("Error1"))
  // cf.registerSeller('Anas','Owner').catch(error=>console.log("Error2"))
};
