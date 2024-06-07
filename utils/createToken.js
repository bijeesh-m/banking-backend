const jwt = require("jsonwebtoken");


const secret = process.env.JWT_SECRET_KEY;

module.exports.createToken = (id) => {
    return jwt.sign({ userId: id }, secret, {
        expiresIn: "1h",
    });
};
