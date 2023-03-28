require("dotenv").config();
const { validationResult } = require("express-validator");

exports.checkValidationError = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }
};

//uses the Haversine's formula to get the km distance between coordinates and returns a price
//WGS 84 CRS is the order of the coordinates in an array is [longitude, latitude]

exports.calculateAmount = (pickup, delivery) => {
  const earthRadius = 6371; // in kilometers
  const [lon1, lat1] = pickup;
  let totalDistance = 0;
  delivery.forEach((d) => {
    const [lon2, lat2] = d.coordinates;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    totalDistance += distance;
  });
  console.log("total distance: ", totalDistance);
  let price = Math.ceil(totalDistance * 100);

  if (price < 500){
    return price = 500;
  }

  return price;
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// module.exports = calculateDistance;
