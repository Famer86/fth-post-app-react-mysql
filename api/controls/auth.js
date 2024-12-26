const router = require("express").Router()
const bcrypt = require('bcryptjs');

const dbPool = require("../routes/db.js")

//register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10) //güvenli parola olusturma
        const hashedPassword = await bcrypt.hash(password, salt)

        let sql = "INSERT INTO auth (username, email, password) VALUES (?,?,?)";
        let values = [username, email, hashedPassword];

        const data = await dbPool.execute(sql, values);

        res.status(200).json("A new user created successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

// login
router.post("/login", async (req, res) => {
    try {
        // res.send(req.body.email)
        const user = await dbPool.execute(
            `SELECT * FROM auth WHERE email ="${[req.body.email]}"`
        );

        if (user[0].length === 0) {
            res.status(400).send({ error: "User not found" })
        } else {

            const validPassword = await bcrypt.compare(
                req.body.password, // formdan gönderilen 
                user[0][0]["password"] // veritabanından gelen karsilastirilir
            );

            if (!validPassword) {
                res.status(403).json("Invalid password!");
            } else {
                res.status(200).json(user[0][0]);
            }
        }

    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router