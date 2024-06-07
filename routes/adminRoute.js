const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.delete("/logout", adminController.logout);
router.get("/getadmin", adminController.getAdmin);
router.get("/transactions", adminController.getTransactions);
router.get("/users", adminController.getUsers);
router.put("/accountAction/:userId", adminController.accountAction);
router.get("/transaction/:id", adminController.transactionByUser);

module.exports = router;
