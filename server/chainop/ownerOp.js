const common = require('./common');
const jwt = require('jsonwebtoken');

const ownerOp = {
  async addProduct({ productId,secretId, price, name, details }, privateKey) {
    try {
      
      const signedTransaction = await common.signTransaction(
        `addProduct('${productId}', '${secretId}', '${price}', '${name}', '${details}')`,
        privateKey,
      );
      const result = await common.sendTransaction(signedTransaction);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to add product');
    }
  },

  async unblockSeller(sellerAddress, privateKey) {
    try {
      const signedTransaction = await common.signTransaction(
        `unblockSeller('${sellerAddress}')`,
        privateKey,
      );
      const result = await common.sendTransaction(signedTransaction);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to unblock seller');
    }
  },
  async transferOwner(sellerPrivateKey, ownerPrivateKey) {
    try {
      const sellerAccount = await common.returnAccount(sellerPrivateKey)
      // console.log(sellerAccount);
      const sellerAddress = sellerAccount.address
      const signedTransaction = await common.signTransaction(
        `transferOwnership('${sellerAddress}')`,
        ownerPrivateKey,
      );
      
      const result = await common.sendTransaction(signedTransaction);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to transfer owner');
    }
  },

};

module.exports = ownerOp;
