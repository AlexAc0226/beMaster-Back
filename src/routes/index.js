const express = require('express');
const router = express.Router();

const authRoute = require("./auth");
const userRoute = require("./users");
const contentRoute = require("./contents");
const categoryRoute = require("./category");
const bulkMoviesRoute = require("./bulkMovies");

router.use("/api/auth", authRoute);
router.use("/api/users", userRoute);
router.use("/api/contents", contentRoute);
router.use("/api/categories", categoryRoute);
router.use("/api/bulkMovies", bulkMoviesRoute);

module.exports = router
