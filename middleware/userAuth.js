const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

const userAuth = (req, res, next) => {
    const token = req.cookies.userToken;
    if (token !== " ") {
        jwt.verify(token, secretKey, (err) => {
            if (err) {
                res.status(401).send("Unauthorized");
            } else {
                next();
            }
        });
    } else {
        res.status(401).send("Unauthorized");
    }
};

module.exports = userAuth;
