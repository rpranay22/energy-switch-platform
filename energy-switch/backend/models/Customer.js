const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Customer = sequelize.define("Customer", {

    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },

    eircode: {
        type: DataTypes.STRING,
        allowNull: false
    },

    address: {
        type: DataTypes.STRING
    },

    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },

    mprn: {
        type: DataTypes.STRING,
        allowNull: false
    },

    meterNumber: {
        type: DataTypes.STRING
    },

    meterReading: {
        type: DataTypes.STRING
    }

});

module.exports = Customer;