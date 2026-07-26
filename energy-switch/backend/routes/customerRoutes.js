const express = require("express");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");


const sequelize = require("../config/database"); // <-- Change this path if needed
const Customer = require("../models/Customer");
const User = require("../models/User");

const router = express.Router();

function removeSensitiveFields(customer) {
    const result = customer.toJSON();
    delete result.passwordHash;
    return result;
}

// Create Customer
router.post("/createCustomer", async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const existingCustomer = await Customer.findOne({
            where: {
                email: req.body.email,
            },
            transaction,
        });

        if (existingCustomer) {
            await transaction.rollback();

            return res.status(409).json({
                error: "A customer with this email already exists.",
            });
        }

        const existingUser = await User.findOne({
            where: {
                email: req.body.email,
            },
            transaction,
        });

        if (existingUser) {
            await transaction.rollback();

            return res.status(409).json({
                error: "A user with this email already exists.",
            });
        }

        const customer = await Customer.create(
            {
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
            },
            { transaction }
        );

        // Temporary password
        const temporaryPassword = "Temp@12345";

        const passwordHash = await bcrypt.hash(
            temporaryPassword,
            10
        );

        await User.create({
            email: req.body.email,
            password_hash: passwordHash,
            status: "active",
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({
            message: "Lead and user created successfully",
            temporaryPassword, // Remove in production
            data: removeSensitiveFields(customer),
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }

        console.error("Create lead error:", error);

        return res.status(500).json({
            error: error.message,
        });
    }
});

// Get Customers
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
            order: [["createdAt", "DESC"]],
        });

        return res.json({
            totalCustomers,
            returnedCount: customers.length,
            data: customers.map(removeSensitiveFields),
        });
    } catch (error) {
        console.error("Get customers error:", error);

        return res.status(500).json({
            error: error.message,
        });
    }
});

module.exports = router;