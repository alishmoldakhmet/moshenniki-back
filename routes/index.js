const express = require("express")
const router = express.Router()

/* Routers */
const api = require("./api")
// const admin = require("./admin")

router.use("/api/", api)
// router.use("/admin/", admin)

module.exports = router
