const express = require("express");
const { createSalaryEntry } = require("../controller/salaryController");

const router = express.Router();

router.post("/", createSalaryEntry);

module.exports = router;
