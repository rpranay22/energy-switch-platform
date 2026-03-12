const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

router.post("/createCustomer", async (req, res) => {

    try {

        const customer = await Customer.create(req.body);

        res.json({
            message: "Customer saved successfully",
            data: customer
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;