const express = require("express")
const router = express.Router()

const dbPool = require("../routes/db.js")

//all categories
router.get("/", async (req, res) => {
    try {
        const data = await dbPool.execute("SELECT * from category");
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

//id select category
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbPool.execute(
            "SELECT * FROM `category` WHERE id=" + [id]
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

//insert new category in the database
router.post("/add", async (req, res) => {
    try {
        const addcategory = req.body;
        let sql = "INSERT INTO category (title) VALUES (?)";
        let values = [addcategory.title];

        const data = await dbPool.execute(sql, values);

        const id = data[0].insertId;

        const newCreateddata = await dbPool.execute(
            "SELECT * FROM category WHERE id=" + [id]
        );

        res.status(200).json(newCreateddata[0][0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

// update category
router.put("/update/:id", async (req, res) => {
    const selectCategory = req.body;
    const id = req.params.id;

    try {
        let sql = "UPDATE category SET title=? WHERE id = ?";
        let values = [selectCategory.title, id];

        let data = await dbPool.execute(sql, values);

        if (data[0].affectedRows === 0) {
            //return not found
            res.status(400).json();
            return;
        }

        const newCreateddata = await dbPool.execute(
            "SELECT * FROM category WHERE id=" + [id]
        );

        res.status(200).json(newCreateddata[0][0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete category
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbPool.execute("DELETE FROM `category` WHERE id = ?", [
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