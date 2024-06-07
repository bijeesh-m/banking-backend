const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/createToken");
const userModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email: email });
        if (admin) {
            const auth = await bcrypt.compare(password, admin.password);
            if (auth) {
                const token = createToken(email);
                res.cookie("adminToken", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
                res.status(200).json({ message: "login success", token, admin });
            } else {
                res.status(401).json({ message: "Incorrect password or email" });
            }
        } else {
            res.status(401).json({ message: "Incorrect password or email" });
        }
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
};

module.exports.logout = async (req, res) => {
    res.cookie("adminToken", "", { maxAge: 1 });
    res.status(200).json({ message: "success" });
};

module.exports.getAdmin = async (req, res) => {
    try {
        const token = req.cookies.adminToken;
        const payload = jwt.decode(token, process.env.JWT_SECRET_KEY);
        const admin = await adminModel.findOne({ email: payload?.userId });
        res.status(200).json({ admin: admin });
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
};

module.exports.getUsers = async (req, res) => {
    const users = await userModel.find();
    res.status(200).json({ message: "success", users });
};

module.exports.getTransactions = async (req, res) => {
    const transactions = await transactionModel.find();
    res.status(200).json({ message: "success", transactions });
};
module.exports.accountAction = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
    console.log(req.body);
    const user = await userModel.findByIdAndUpdate(userId, { $set: { accountStatus: status } }, { new: true });
    res.status(200).json({ message: "success", user });
};
module.exports.transactionByUser = async (req, res) => {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    const transaction = await transactionModel.findOne({ accountNumber: user.accountNumber });
    res.status(200).json({ message: "success", transaction });
};
