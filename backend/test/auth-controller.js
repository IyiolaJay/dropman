require("dotenv").config();
const expect = require("chai").expect;
const mongoose = require("mongoose");
const User = require("../models/users");
const authController = require("../controllers/auth");

const URI = process.env.MONGODB_URI_TEST;
let userId;

describe("Auth controller Tests", function () {

// This block runs before every tests    
  before(function (done) {
    mongoose
      .connect(URI)
      .then((result) => {
        const user = new User({
          firstName: "Ha",
          lastName: "Iyiola",
          phoneNumber: "+2347869687089",
          address: "12 agbedina street",
          email: "jimoh.iyiola11@gmail.com",
          password: "abcdefucku",
          userType: "rider",
        });

        return user.save();
      })
      .then((user) => {
        userId = user._id.toString();
      })
      .catch((err) => {
        console.log("Error Occurred:  ", err);
      });
    done();
  });
  describe("user login test", function(){
    
  it("should throw an error if user already exists", function (done) {
    const req = {
      body: {
        _id: userId,
        firstName: "Ha",
        lastName: "Iyiola",
        phoneNumber: "+2347869687089",
        address: "12 agbedina street",
        email: "jimoh.iyiola11@gmail.com",
        password: "abcdefucku",
        userType: "rider",
      },
    };
    authController
      .createAccount(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.instanceof(Error);
        done();
      })
      .catch((err) => {
        done();
      });
  });




//This block runs after every test
  })
  after(function (done) {
    this.timeout(10000);

    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done();
      });
  });
});
