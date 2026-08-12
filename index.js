const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Database connection
mongoose.connect(process.env.MONGO_STRING);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.once("open", () => {
    console.log("We're connected to the cloud database");
});

if (require.main == module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log(
            `Server is running at port ${process.env.PORT || 3000}`
        );
    });
}

module.exports = { app, mongoose };