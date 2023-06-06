const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const isAuthenticated = require("../middleware/authMiddleware.js");

router.get("/:id", isAuthenticated, userController.getUser);
router.post("/:id", isAuthenticated, userController.postJournal);
router.get("/:id/:post_id", isAuthenticated, userController.getJournal);
router.patch("/:id/:post_id", isAuthenticated, userController.updateJournal);
router.delete("/:id/:post_id", isAuthenticated, userController.deleteJournal);

module.exports = router;