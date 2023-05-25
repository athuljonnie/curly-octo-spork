var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { Logger } = require("mongodb");
var objectId = require("mongodb").ObjectId;

module.exports = {
  doSignup: async (userData) => {
    // console.log(userData.password);
    userData.Password = await bcrypt.hash(userData.Password, 10);
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        resolve(false);
      } else {
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne(userData)
          .then((data) => {
            console.log(data);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            console.log("login success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("login failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("login failed");
        resolve({ status: false });
      }
    });
  },
  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find()
        .toArray();
      resolve(users);
    });
  },
  deleteUser: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .deleteOne({ _id: objectId(proId) })
        .then((response) => {
          resolve(true);
        });
    });
  },
  getUserDetails: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .findOne({ _id: objectId(userId) })
        .then((user) => {
          resolve(user);
        });
    });
  },
  updateUser: (userId, UserDetails) => {
    console.log(UserDetails);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: objectId(userId) },
          {
            $set: {
              Name: UserDetails.Name,
              Email: UserDetails.Email,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  searchUser: (data) => {
    return new Promise(async (resolve, reject) => {
      let regex = new RegExp(data, "i");
      let users = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find({
          $or: [{ Name: { $regex: regex } }, { Email: { $regex: regex } }],
        })
        .toArray();
      resolve(users);
    });
  },
  addUsers: (userData) => {
    return new Promise(async (res, rej) => {
      userData.Password = await bcrypt.hash(userData.Password, 10)
      db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
        res(data.insertedId)

      })
    })
  },
};
