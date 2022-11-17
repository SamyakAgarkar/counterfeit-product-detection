'use strict';

const models = require('../model');

const commonModel = models.commonModel;

const commonManager = {
  checkEmailRegistered: function (email, type = 'seller') {
    return new Promise((resolve, reject) => {
      commonModel
        .get(email.trim().toLowerCase(), type.trim().toLowerCase())
        .then((response) => {
          console.log("Response when checking registered email: ", response)
          if (response && response.length === 0) {
            return resolve(true);
          }
          throw new Error('email already exist');
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async checkSeller(email, type) {
    try {
      const response = await commonModel.get(email.trim().toLowerCase(), type.trim().toLowerCase())

      if (response && response.length === 0) {
        throw new Error('seller not registered');
      }
      return response[0];
    }
    catch (error) {
      console.log(error);
      throw Error("Failed to check")
    }
  },
  storeSeller: function (email, hash, privateKey, type = 'seller') {
    return new Promise((resolve, reject) => {
      commonModel
        .set(email.trim().toLowerCase(), hash, privateKey, type.trim().toLowerCase())
        .then((response) => {
          return resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async getPrivateKeyByEmail(email, type = 'seller') {
    try {
      const result = await commonModel.get(email, type);
      if (!result || result.length === 0) {
        throw new Error('email not found in user table');
      }
      return result[0].privateKey;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to get private key');
    }
  },
  getPasswordByEmail: function (email, type = 'seller') {
    return new Promise((resolve, reject) => {
      commonModel
        .get(email, type)
        .then((response) => {
          console.log("GetPasswordByEmail: ", response)
          if (!response || response.length === 0) {
            throw new Error('email not found in user table');
          }
          //check and return only email
          return resolve(response[0].password);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async removeAccount(email) {
    try {
      await commonModel.remove(email.trim().toLowerCase())
    }
    catch (error) {
      console.log(error);
      throw Error("Failed to remove Account")
    }
  },
  async updateDetails(values,email) {
    try {
      await commonModel.update(values,email)
    }
    catch (error) {
      console.log(error);
      throw Error("Failed to update Account")
    }
  }
};

module.exports = commonManager;
