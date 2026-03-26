require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const customerRoutes = require("./routes/customerRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(cors({
    origin: [
        "https://energy-switch-platform-5.onrender.com",
        "https://strong-figolla-d614b5.netlify.app"
    ]
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend server is running");
});

app.use("/api", customerRoutes);
app.use("/api", chatRoutes);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync();
        console.log("Database synced successfully");

        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();