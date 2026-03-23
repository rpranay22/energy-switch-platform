const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME || "defaultdb",
    process.env.DB_USER || "avnadmin",
    process.env.DB_PASSWORD || "YOUR_DB_PASSWORD",
    {
        host:
            process.env.DB_HOST ||
            "mysql-311e2d6c-pranayreddy123-db51.f.aivencloud.com",
        port: process.env.DB_PORT || 28655,
        dialect: "mysql",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
    }
);

module.exports = sequelize;