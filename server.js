const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();
const cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/admin", adminRoute);

mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log("db connected"))
    .catch((err) => console.log(err));

app.listen(process.env.PORT, () => console.log("server running"));
