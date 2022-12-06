const express = require("express")
const router = express.Router()
const { listData, addData, patchData, deleteData } = require("../controllers/db-controller");
const { verifyToken, getUser } = require("../controllers/user-controller");


router.get("/list", verifyToken, listData);
router.post("/add", verifyToken, addData);
router.patch("/update", verifyToken, patchData);
router.delete("/delete", verifyToken, deleteData);

module.exports = router
