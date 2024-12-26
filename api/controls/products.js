const express = require("express")
const router = express.Router()

const dbPool = require("../routes/db.js")

// products tablo alanları
//id	title	img	price	category	timestaps	

//all products
router.get("/", async (req, res) => {
    try {
        const data = await dbPool.execute("SELECT * from products");
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

//id select products
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbPool.execute(
            "SELECT * FROM `products` WHERE id=" + [id]
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

//insert new product in the database
router.post("/add", async (req, res) => {
    try {
        const addproduct = req.body;
        let sql = "INSERT INTO products (title, img, price, category) VALUES (?,?,?,?)";
        let values = [addproduct.title, addproduct.img, addproduct.price, addproduct.category];

        const data = await dbPool.execute(sql, values);

        const id = data[0].insertId;

        const newCreateddata = await dbPool.execute(
            "SELECT * FROM products WHERE id=" + [id]
        );

        res.status(200).json(newCreateddata[0][0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

// update product
router.put("/update/:id", async (req, res) => {
    const selectProduct = req.body;
    const id = req.params.id;

    try {
        let sql = "UPDATE products SET title=?,img=?,price=?,category=? WHERE id = ?";
        let values = [selectProduct.title, selectProduct.img, selectProduct.price, selectProduct.category, id];

        let data = await dbPool.execute(sql, values);

        if (data[0].affectedRows === 0) {
            //return not found
            res.status(400).json();
            return;
        }

        const newCreateddata = await dbPool.execute(
            "SELECT * FROM products WHERE id=" + [id]
        );

        res.status(200).json(newCreateddata[0][0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete products
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbPool.execute("DELETE FROM `products` WHERE id = ?", [
            id,
        ]);

        if (data[0].affectedRows === 0) {
            //return not found (400)
            res.status(400).json();
            return;
        }

        res.status(200).json();
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router