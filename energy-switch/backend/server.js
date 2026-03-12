const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./config/database");
const Customer = require("./models/Customer");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
    res.send("Backend server is running 🚀");
});


// Create Customer API
app.post("/api/createCustomer", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            eircode,
            provider,
            mprn,
            meterNumber,
            meterReading
        } = req.body;

        const customer = await Customer.create({
            firstName,
            lastName,
            email,
            phone,
            eircode,
            provider,
            mprn,
            meterNumber,
            meterReading
        });

        res.status(201).json({
            message: "Customer saved successfully",
            data: customer
        });

    } catch (error) {

        console.error("Error saving customer:", error);

        res.status(500).json({
            message: "Error saving customer",
            error: error.message
        });

    }

});


// Start server
async function startServer() {

    try {

        await sequelize.authenticate();
        console.log("Database connected successfully ✅");

        await sequelize.sync();
        console.log("Tables synced successfully ✅");

        app.listen(5000, () => {
            console.log("Server running on port 5000 🚀");
        });

    } catch (error) {

        console.error("Database connection failed ❌", error);

    }

}

startServer();