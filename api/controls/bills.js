const express = require("express")
const router = express.Router()

const dbPool = require("../routes/db.js")

//all bills
router.get("/", async (req, res) => {
    try {
        const data = await dbPool.execute("SELECT * from bills");
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

//insert new bill in the database
router.post("/add", async (req, res) => {
    try {
        const addbill = req.body;
        let sql = "INSERT INTO bills (customername, customerphonenumber, paymentmode, cartitems, subtotal, tax, totalamount) VALUES (?,?,?,?,?,?,?)";
        let values = [addbill.customername, addbill.customerphonenumber, addbill.paymentmode, addbill.cartitems, addbill.subtotal,addbill.tax,addbill.totalamount];

        const data = await dbPool.execute(sql, values);

        const id = data[0].insertId;

        const newCreateddata = await dbPool.execute(
            "SELECT * FROM bills WHERE id=" + [id]
        );

        res.status(200).json(newCreateddata[0][0]);
    } catch (error) {
        res.status(500).json(error);
    }
});



module.exports = router