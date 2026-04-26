const express = require("express");
const { createSalaryEntry, getSalaryEntries, updateSalaryEntry, deleteSalaryEntry } = require("../controller/salaryController");

const router = express.Router();

router.get("/", getSalaryEntries);
router.post("/", createSalaryEntry);
router.put("/:id", updateSalaryEntry);
router.delete("/:id", deleteSalaryEntry);

module.exports = router;
