const userModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");
const { createToken } = require("../utils/createToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body);
        const userExist = await userModel.findOne({ email: email });
        console.log(userExist);
        if (userExist) {
            console.log("hello");
            res.status(404).json({ message: "user already exist" });
        } else {
            await userModel.create(req.body);
            res.status(200).json({ message: "Register success" });
        }
    } catch (error) {
        throw new Error("Something went wrong!");
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = createToken(email);
                res.cookie("userToken", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
                res.status(200).json({ message: "login success", token, user });
            } else {
                res.status(401).json({ message: "Incorrect password or email" });
            }
        } else {
            res.status(401).json({ message: "Incorrect password or email" });
        }
    } catch (error) {
        throw new Error("Something went wrong");
    }
};
module.exports.logout = async (req, res) => {
    res.cookie("userToken", "", { maxAge: 1 });
    res.status(200).json({ message: "success" });
};

module.exports.getUser = async (req, res) => {
    try {
        const token = req.cookies.userToken;
        const payload = jwt.decode(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findOne({ email: payload?.userId }).populate("transactions");
        res.status(200).json({ user: user });
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
};
module.exports.deposit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount, password } = req.body;

        const user = await userModel.findById(userId);
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const transaction = await transactionModel.create({
                    accountNumber: user.accountNumber,
                    transactionType: "deposit",
                    amount: amount,
                    status: "completed",
                });
                const ubalance = user.balance + Number(amount);
                const uUser = await userModel.findByIdAndUpdate(
                    userId,
                    {
                        $set: { balance: ubalance },
                        $push: { transactions: transaction._id },
                    },
                    { new: true }
                );
                res.status(200).json({ message: amount + "rs Deposited successfully", user: uUser });
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        }
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
};
module.exports.withdraw = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount, password } = req.body;

        const user = await userModel.findById(userId);
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const transaction = await transactionModel.create({
                    accountNumber: user.accountNumber,
                    transactionType: "withdrawal",
                    amount: amount,
                    status: "completed",
                });
                const ubalance = user.balance - Number(amount);
                const uUser = await userModel.findByIdAndUpdate(
                    userId,
                    {
                        $set: { balance: ubalance },
                        $push: { transactions: transaction._id },
                    },
                    { new: true }
                );
                res.status(200).json({ message: amount + " rs Withdrawed successfully", user: uUser });
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        }
    } catch (error) {
        throw new Error("Something went wrong");
    }
};
