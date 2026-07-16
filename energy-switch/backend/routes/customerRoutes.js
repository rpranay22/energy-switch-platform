const express = require("express");
const { Op } = require("sequelize");
const Customer = require("../models/Customer");

const router = express.Router();

function removeSensitiveFields(customer) {
    const result = customer.toJSON();

    delete result.passwordHash;

    return result;
}

router.post("/createCustomer", async (req, res) => {
    try {
        const existingCustomer = await Customer.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (existingCustomer) {
            return res.status(409).json({
                error: "A customer with this email already exists.",
            });
        }

        const customer = await Customer.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            eircode: req.body.eircode,
            address: req.body.address || null,
            provider: req.body.provider,
            mprn: req.body.mprn,
            meterNumber: req.body.meterNumber || null,
            meterReading: req.body.meterReading || null,
            paymentMethod: req.body.paymentMethod || null,
            preferredContactTime:
                req.body.preferredContactTime || null,
            status: "LEAD",
        });

        return res.status(201).json({
            message: "Lead created successfully",
            data: removeSensitiveFields(customer),
        });
    } catch (error) {
        console.error("Create lead error:", error);

        return res.status(400).json({
            error: error.message,
        });
    }
});

router.get("/customers", async (req, res) => {
    try {
        const {
            id,
            email,
            status,
            search = "",
        } = req.query;

        const where = {};

        if (id) {
            where.id = id;
        }

        if (email) {
            where.email = email;
        }

        if (status && status !== "ALL") {
            where.status = status;
        }

        if (search.trim()) {
            where[Op.or] = [
                {
                    firstName: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    lastName: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    phone: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    eircode: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    mprn: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ];
        }

        const totalCustomers = await Customer.count();

        const customers = await Customer.findAll({
            where,
            attributes: {
                exclude: ["passwordHash"],
            },
            order: [["createdAt", "DESC"]],
        });

        return res.json({
            totalCustomers,
            returnedCount: customers.length,
            data: customers,
        });
    } catch (error) {
        console.error("Get customers error:", error);

        return res.status(500).json({
            error: error.message,
        });
    }
});

module.exports = router;