const express = require("express")
const router = express.Router()
const { listData, addData, patchData, deleteData } = require("../controllers/db-controller");


router.get("/list", listData);
router.post("/add", addData);
router.patch("/update", patchData);
router.delete("/delete", deleteData);

module.exports = router
