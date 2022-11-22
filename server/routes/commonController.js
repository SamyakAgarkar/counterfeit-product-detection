const manager = require('../manager');
const commonManager = manager.commonManager;
const sellerOp = require('../chainop/sellerOp');
const commonOp = require('../chainop/commonOp');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const userOp = require('../chainop/userOp');
const common = require('../chainop/common');

const commonController = {
  login: async function (req, res, next) {
    try {
      if (!req.body) {
        throw new Error('no body');
      }
      const { email, password, type } = req.body;
      if (!email || !password) {
        throw new Error('Invalid email or password');
      }

      const response = await commonManager.getPasswordByEmail(email, type);

      console.log("Response from GetPasswordByEmail: ", response)

      if (await argon2.verify(response, password)) {
        console.log("Setting JWT Token")
        res.cookie('jwt', jwt.sign(email, process.env.JWT_SECRET_KEY));

        return res.send('Login successfully');
      } else {
        throw new Error('Password does not match');
      }
    } catch (error) {
      return next(error);
    }
  },

  signup: async function (req, res, next) {
    try {
      if (!req.body) {
        next(new Error('no body'));
      }
    
      const { email, password, name, details, type, privateKey } = req.body;
      //console.log("Req Body: ", req.body)

      if (!email || !password) {
        next(new Error('Invalid email or password'));
      }
      if (!name || !details) {
        next(new Error('Name or details not provided'));
      }
      console.log("Checking Registered Email")
      await commonManager.checkEmailRegistered(email, type);      
      console.log("Done")
      console.log("Argon2 Hash")
      
      const hash = await argon2.hash(password);
      // const privateKey = await sellerOp.genKey();
      console.log("Done: Passwork Has is : ", hash)
      console.log("Store Seller Info")
      
      await commonManager.storeSeller(email, hash, privateKey, type);
      console.log("Done")
      console.log("Register PK")
      
      await sellerOp.register(privateKey, name, details);
      console.log("Done")
      console.log("Setting JWT")
      
      res.cookie('jwt', jwt.sign(email, process.env.JWT_SECRET_KEY));
      console.log("Done")
      res.send('Seller registered successfully');
    } catch (error) {
      commonManager.removeAccount(req.body.email)
        .then(result => {
          next(error)
        }).catch(err => {
          console.log("Failed to remove")
          next(error)
        })
    }
  },

  logout: function (req, res, next) {
    res.clearCookie('jwt');
    res.send();
  },

  getAllProducts: async function (req, res, next) {
    try {
      if (!req.body) {
        throw new Error('Nothing in request object');
      }

      const email = req.email;

      const { type } = req.body;

      if (!email) {
        throw new Error('Details incomplete');
      }
      const privateKey = await commonManager.getPrivateKeyByEmail(email, type);
      
      const products = await commonOp.getAllProducts(privateKey);

      // const address = ownerAddress.address.substr(2,ownerAddress.address.length);
      // console.log(address)
      
      res.send(products);
    } catch (error) {
      return next(error);
    }
  },
  
  getProductDetails: async function (req, res, next) {
    try {
      if (!req.body) {
        throw new Error('Nothing in request object');
      }

      // productId of the product extracted from qr code...
      // console.log(req.body)
      const { productId } = req.body;

      if (!productId) {
        throw new Error('Details incomplete');
      }

      const productDetails = await userOp.getProductDetails(productId);
      res.send({ productDetails: productDetails });
    } catch (error) {
      return next(error);
    }
  },

  getSellerOfProduct: async function (req, res, next) {
    try {
      if (!req.body) {
        throw new Error('Nothing in request object');
      }

      // secretId of the product extracted from qr code...
      const { productId } = req.body;

      if (!productId) {
        throw new Error('Details incomplete');
      }
      const productSeller = await userOp.getSellerOfProduct(productId);
      res.send({ seller: productSeller });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = commonController;
