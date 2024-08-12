const express = require("express")
const router = express.Router()

const user = require("../controllers/api/UserController")
const review = require("../controllers/api/ReviewController")

router.use('/user/', user)
router.use('/review/', review)

module.exports = router