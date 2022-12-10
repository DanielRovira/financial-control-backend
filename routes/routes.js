const express = require("express")
const router = express.Router()
const { listData, addData, patchData, deleteData } = require("../controllers/db-controller");
const { verifyToken, getUser } = require("../controllers/user-controller");
const { ObjectId } = require('mongodb')

const checkBody = (req,res,next) => {
    if ("_id" in req.body) {
        req.body._id = ObjectId(req.body._id)
    }
    next()
}

router.get("/list/:id", verifyToken, listData);
router.post("/add/:id", verifyToken, addData);
router.patch("/update/:id", verifyToken, checkBody, patchData);
router.delete("/delete/:id", verifyToken, checkBody, deleteData);

module.exports = router
