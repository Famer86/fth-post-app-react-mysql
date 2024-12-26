const express = require("express");
const router = express.Router();

// Diğer rota dosyalarını içe aktarıyoruz
const categoryRoute = require("../controls/category");
const productRoute = require("../controls/products");
const billRoute = require("../controls/bills");
const authRoute = require("../controls/auth");
const userRoute = require("../controls/users");

// Her rotayı ilgili yol altında kullanıyoruz
router.use("/categories", categoryRoute);
router.use("/products", productRoute);
router.use("/bills", billRoute);
router.use("/auth", authRoute);
router.use("/users", userRoute);

module.exports = router;