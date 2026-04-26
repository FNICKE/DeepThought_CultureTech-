const express = require("express");
const { createOvertimeEntry, getOvertimeEntries, updateOvertimeEntry, deleteOvertimeEntry } = require("../controller/overtimeController");

const router = express.Router();

router.get("/", getOvertimeEntries);
router.post("/", createOvertimeEntry);
router.put("/:id", updateOvertimeEntry);
router.delete("/:id", deleteOvertimeEntry);

module.exports = router;
