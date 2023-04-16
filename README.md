## Dropman

Dropman is an open source delivery/logistic service that handles delivery service from one location to another, as well as multiple location deliveries. With Dropman, users can request for the services deliverymen just like requesting for Uber rides.

The project is organized into two major folders, backend and frontend, with each folder containing the corresponding code for its respective framework. The backend of the project is built with Express.js, while the frontend is built with React.js.

### Installation

To install the project, you'll need to have Node.js and npm installed on your computer. Then, you can follow these steps:

- Clone the repository to your local machine using the command below.

```js
git clone https://github.com/IyiolaJay/dropman.git
```

- Navigate to the project root directory using cd dropman
- Install the backend dependencies using `npm install` in the backend folder.
- Install the frontend dependencies using `npm install` in the frontend folder.

### Running the App

To run the app, you'll need to start both the backend and frontend servers. Here's how to do that:

In the backend folder, run `npm start` to start the backend server.
In the frontend folder, run `npm start` to start the frontend server.

### Contributing

We welcome contributions to the Dropman project! If you would like to contribute,please check out the [Contributions.md](https://github.com/IyiolaJay/dropman/blob/main/Contributions.md) file to see how you can help.

### Usage

To use Dropman, you can visit the deployed version of the app (if available), or you can run it locally on your machine (see the installation instructions above).

### Keynotes of How Dropman Works

Customers

- Requests expire after 1 hour of no acceptance.
- Customers can have multiple locations of deliveries for a single request.
- Customers can get an estimate for a delivery location.

Riders
- Riders can accept a maximum of 3 requests at a time.
- Riders will generate an OTP which will be sent to the recipient's phone number to validate delivery.
- Riders will ignore and won't be able to accept other requests if they haven't reached the limit of 5 until they complete the current delivery.

### License

Dropman is licensed under the MIT License. Feel free to use and modify the code for your own purposes.

### Contact

If you have any questions or comments about Dropman, please feel free to contact at jimoh.iyiola11@gmail.com.
Thank you for your interest in Dropman
