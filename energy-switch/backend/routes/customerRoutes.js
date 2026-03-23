const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const { Op } = require("sequelize");

// CREATE customer
router.post("/createCustomer", async (req, res) => {
    try {
        const customer = await Customer.create(req.body);

        res.status(201).json({
            message: "Customer saved successfully",
            data: customer,
        });
    } catch (error) {
        console.error("Create customer error:", error);
        res.status(500).json({
            error: error.message,
        });
    }
});

// GET customers
router.get("/customers", async (req, res) => {
    try {
        const { id, email } = req.query;

        const totalCustomers = await Customer.count();

        let whereClause = {};

        if (id) {
            whereClause.id = id;
        } else if (email) {
            whereClause.email = email;
        }

        const customers = await Customer.findAll({
            where: whereClause,
            order: [["id", "ASC"]],
        });

        res.status(200).json({
            message: "Customers fetched successfully",
            totalCustomers,
            returnedCount: customers.length,
            data: customers,
        });
    } catch (error) {
        console.error("Get customers error:", error);
        res.status(500).json({
            error: error.message,
        });
    }
});

module.exports = router;