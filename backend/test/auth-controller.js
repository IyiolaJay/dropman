require("dotenv").config();
const expect = require("chai").expect;
const mongoose = require("mongoose");
const User = require("../models/users");
const authController = require("../controllers/auth");
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");

chai.use(chaiAsPromised);

const URI = process.env.MONGODB_URI_TEST;
let userId;

describe("Auth controller Tests", () => {
  // This block runs before every test
  before(async () => {
    await mongoose.connect(URI);
    const user = new User({
      firstName: "Ha",
      lastName: "Test",
      phoneNumber: "+2347869687089",
      address: "12 agbedina street",
      email: "tester@gmail.com",
      password: "abcdefucku",
      userType: "rider",
    });
    const savedUser = await user.save();
    userId = savedUser._id.toString();
  });

  //test block
  describe("user login test", () => {
    //test case
    it("should throw an error if user already exists", async () => {
      const req = {
        body: {
          _id: userId,
          firstName: "Ha",
          lastName: "Doe",
          phoneNumber: "+2347869687089",
          address: "12 agbedina street",
          email: "tester@gmail.com",
          password: "abcdefucku",
        },
        query: {
          userType: "rider",
        },
      };
      const result = await authController.createAccount(req, {}, () => {});
      expect(result).to.be.instanceof(Error);
    });

    // test case
    it("should successfully create a user account and return status 201", async () => {
      this.timeout = 15000;
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "+2147869687089",
          address: "12 agbedina street",
          email: "test11@gmail.com",
          password: "abcdefucku",
        },
        query: {
          userType: "customer",
          email: false,
        },
      };

      const res = {
        statusCode: 500,
        success: false,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.success = data.success;
          return this;
        },
      };

      const result = await authController.createAccount(req, res, () => {});
      expect(result.statusCode).to.equal(201);
      expect(result.success).to.equal(true);
    });

    //This block runs after every test
  });

  after(async () => {
    // this.timeout(10000);
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});

// require("dotenv").config();
// const expect = require("chai").expect;
// const mongoose = require("mongoose");
// const User = require("../models/users");
// const authController = require("../controllers/auth");

// const URI = process.env.MONGODB_URI_TEST;
// let userId;

// describe("Auth controller Tests", function () {
//   // This block runs before every tests
//   before(function (done) {
//     mongoose
//       .connect(URI)
//       .then((result) => {
//         const user = new User({
//           firstName: "Ha",
//           lastName: "Test",
//           phoneNumber: "+2347869687089",
//           address: "12 agbedina street",
//           email: "tester@gmail.com",
//           password: "abcdefucku",
//           userType: "rider",
//         });

//         return user.save();
//       })
//       .then((user) => {
//         userId = user._id.toString();
//         done();
//       })
//       .catch((err) => {
//         console.log("Error Occurred:  ", err);
//         done();
//       });
//   });

//   //test block
//   describe("user login test", function () {
//     //test case
//     it("should throw an error if user already exists", function (done) {
//       const req = {
//         body: {
//           _id: userId,
//           firstName: "Ha",
//           lastName: "Doe",
//           phoneNumber: "+2347869687089",
//           address: "12 agbedina street",
//           email: "tester@gmail.com",
//           password: "abcdefucku",
//           userType: "rider",
//         },
//       };
//       authController
//         .createAccount(req, {}, () => {})
//         .then((result) => {
//           expect(result).to.be.instanceof(Error);
//           done();
//         })
//         .catch((err) => {
//           done();
//         });
//     });

//     // test case
//     it("should successfully create a user account and return status 201", function (done) {
//       this.timeout = 15000;
//       const req = {
//         body: {
//           firstName: "John",
//           lastName: "Doe",
//           phoneNumber: "+2147869687089",
//           address: "12 agbedina street",
//           email: "test11@gmail.com",
//           password: "abcdefucku",
//           userType: "",
//         },
//         query: {
//           userType: "customer",
//           sendMail: false,
//         },
//       };

//       const res = {
//         statusCode: 500,
//         success: false,
//         status: function (code) {
//           this.statusCode = code;
//           return this;
//         },
//         json: function (data) {
//           this.success = data.success;
//           return this;
//         },
//       };

//       authController
//         .createAccount(req, res, () => {})
//         .then((result) => {
//           expect(result.statusCode).to.be.equal(201);
//           expect(result.success).to.be.equal(true);
//           done();
//         })
//         .catch((err) => {
//           console.log(err);
//           done();
//         });
//     });

//     //This block runs after every test
//   });
//   after(function (done) {
//     this.timeout(10000);

//     User.deleteMany({})
//       .then(() => {
//         return mongoose.disconnect();
//       })
//       .then(() => {
//         done();
//       })
//       .catch((err) => {
//         done();
//       });
//   });
// });
