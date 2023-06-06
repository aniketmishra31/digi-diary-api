const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware.js");
const userController = require("../controllers/userController");

router.get("/:id", isAuthenticated, userController.getAllPosts);

module.exports=router;