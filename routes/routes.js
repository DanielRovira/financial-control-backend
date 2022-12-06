const express = require("express")
const router = express.Router()
const { listData, addData, patchData, checkBody } = require("../controllers/db-controller");


router.get("/list", listData)
router.post("/add", addData);
router.patch("/update", patchData)

module.exports = router
