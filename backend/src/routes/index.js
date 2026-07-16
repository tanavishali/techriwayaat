const express = require("express");
const contactRoutes = require("./contact.routes");
const careersRoutes = require("./careers.routes");

const router = express.Router();

router.use("/contact", contactRoutes);
router.use("/careers", careersRoutes);

module.exports = router;
