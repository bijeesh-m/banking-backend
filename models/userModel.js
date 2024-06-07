const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    accountNumber: String,
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    accountStatus: {
        type: String,
        default: "Enabled",
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
