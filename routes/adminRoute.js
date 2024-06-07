const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

router.post("/login", adminController.login);
router.delete("/logout", adminController.logout);
router.get("/getadmin", adminAuth, adminController.getAdmin);
router.get("/transactions", adminAuth, adminController.getTransactions);
router.get("/users", adminAuth, adminController.getUsers);
router.put("/accountAction/:userId", adminAuth, adminController.accountAction);

module.exports = router;
