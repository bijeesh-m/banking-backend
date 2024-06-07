const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userAuth = require("../middleware/userAuth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.delete("/logout", userController.logout);
router.get("/getuser", userAuth, userController.getUser);
router.put("/deposit/:userId", userAuth, userController.deposit);
router.put("/withdraw/:userId", userAuth, userController.withdraw);

module.exports = router;
