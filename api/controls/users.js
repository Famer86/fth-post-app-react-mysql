const express = require("express")
const router = express.Router()

const dbPool = require("../routes/db.js")

//all bills
router.get("/get-all", async (req, res) => {
    try {
        const data = await dbPool.execute("SELECT * from auth");
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json(error);
    }
});


//id select user
router.get("/", async (req, res) => {
    const id = req.body.id;
    try {
        const data = await dbPool.execute(
            "SELECT * FROM `auth` WHERE id=" + [id]
        );
        const rows = data[0];
        if (rows.length === 0) {
            res.status(404).json();
        } else {
            res.status(200).json(data[0]);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router