const crypto = require("crypto");
const speakeasy = require("speakeasy");

exports.createTokenHash = async () => {
  try {
    const buffer = await new Promise((resolve, reject) => {
      crypto.randomBytes(25, (err, buffer) => {
        if (err) reject(err);
        resolve(buffer);
      });
    });
    const token = buffer.toString("hex");
    return token;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};

exports.createOtpToken = () => {

  const secret = speakeasy.generateSecret();
  const token = speakeasy.totp({
    secret: secret.base32,
    digits: 6,
  });
  return token;
};
