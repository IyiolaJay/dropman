## Dropman Backend API Reference 

Before installing the backend API, you should ensure that you have the following software installed on your system:

-Node.js (version 12 or later)
-npm (version 6 or later)

### Installation Steps
Clone the repository
```js
git clone https://github.com/IyiolaJay/dropman.git
```
#### Install dependencies
`cd dropman`
`cd backend`
`npm install`

#### Create a `.env` file and configure environment variables
```js
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```
Replace <your-mongodb-uri> with the URI for your MongoDB database and <your-jwt-secret> with a secret key to use for JSON Web Token (JWT) authentication.

#### Start the server
`npm start`

## Interacting with the API
- The current version of the application does not support unauthenticated access to the API endpoints. To access the API, users must obtain an API key which should be included in the header of each request to enable authentication. To generate an API key, users can either sign up on the Dropman dashboard (if available) or send a request to `/api/auth/create`. Some routes in the API require authentication, and these routes will not function properly without a valid API key in the request header.

#### ERROR HANDLING

Errors in the application are returned in JSON format, coupled with traditional http response codes
Sample codes:
+ 2xx : This indicates that a request is successful, an example is the status code '200'.

+ 4xx: indicates that something is not right about the request.

Expected Error codes and their meaning:

- 400 : This indicates that the request is either not properly formatted or there are some missing data
- 406: The request is not acceptable
- 422 : Cannot process a request
- 404: The resource(question or category) is not found
- 500 : Indicates that the issue might be from

An error response example:
This is what an error message would look like

```json
{
"success" : false,
"message": "User not found"
}
```

You can interact with the API using an HTTP client like Postman or cURL.

To use the API, send requests to the appropriate endpoints with the necessary parameters and headers.

## End Points

`POST /api/auth/create`  `public`

### Create an account.
-Create customer account
```js
    /api/auth/create?userType=customer
```
- Request body
```js
{
    "firstName" : "Random",
    "lastName" : "Dev",
    "phoneNumber" : "+2347769687089",
    "address" : "12 somewhere street",
    "email" : "someemail@test.com",
    "password" : "abcdefghi"
}
```

-Create a rider account.
```js
    /api/auth/create?userType=rider
```
- Request body
```js
{
    "firstName" : "Random",
    "lastName" : "Dev",
    "phoneNumber" : "+2347769687089",
    "address" : "12 somewhere street",
    "email" : "someemail@test.com",
    "password" : "abcdefghi"
    "metaData" : {
        "rideType" : "bike"
    }
}
```

| **keys** | **Defaults** | **required** | **type** |
| :------: | :----------: | :----------: | :-----------: |
| firstName | none | yes | any string |
| lastName | none | yes | - | any string |
| phoneNumber | none | yes | any string |
| address | none | yes | any string |
| email | none | yes | any string |
| password | none | yes | any string |
| gender | none  | no | riders only {male or female} |
| metaData | none | no | riders only {rideType : 'bike' or 'truck'} |
| license | none | no | riders `image path` |
| restriction | none | no | Boolean |
| imageUrl | none | no | riders `image path` |
| userType | none | no | {"customer or rider"} |


### Login an account.
`POST /api/auth/login`  `public`

```js
    /api/auth/login
```
- Request body
```js
{
    "email" : "someemail@gmail.com",
    "password" : "somepassword"
}
```

- Note : The `login` will return a jwt token.

### Request for a ride.
`POST /api/customer/request` `requires auth`

```js
    /api/customer/create
```

- Request body
```js
{
  "pickUp": {
    "coordinates": [-73.9857, 40.7484]
  },
  "delivery": [
    {
      "address": {
        "coordinates": [-73.9879, 40.7486]
      },
        "recipientName": "John Doe",
        "recipientPhone": "+1234567890",
        "trackingNumber": "6161f162c860b3503df3dd61"
      },
       {
      "address": {
        "coordinates": [-73.9879, 40.7486]
      },
        "recipientName": "John Doe",
        "recipientPhone": "+1234567890",
        "trackingNumber": "6161f162c860b3503df3dd61"
      }
  ]
  "rideType": "truck"
}
```
 Delivery can have multiple address. The maximum number of addresses per one request is 3. Customers can only have total number of 2 individual requests in the database, and will not be able to add new requests until after delivery or expiration. 

- When customers have multiple delivery address, delivery property should be an array of addresses
`for multiple delivery address`
- Request body
```js
{
    "pickUp" : {
        "coordinates":[6.550991210994359, 3.383910944535353]
        },
    "delivery" : [{
        "coordinates" : [6.551364268302928, 3.384035667257561],
        "deliveryData" :  {
                "recipientName" : "Jay Jay",
                "recipientPhone" : "+2348123456789"
        }
    
    },{
        "coordinates" : [6.551364268302928, 3.384035667257561],
        "deliveryData" :  {
                "recipientName" : "Jay Jay",
                "recipientPhone" : "+2348123456789"
        }
    
    }]
}
```