const express = require('express')
const app = express.Router()

/* UUID */
const { v4: uuidv4 } = require('uuid')

/* DIRNAME */
const dirname = require('path').resolve('./')

/* Middleware */
const verifyToken = require("../../middleware/UserAuthorization")

/* Models */
const { sequelize, Sequelize, Scammer, ScammerPhone, ScammerName, Review, ReviewImage, User } = require('../../db/models')

app.get('/list', async (req, res) => {
    /* Fields */

    const { type, text } = req.query

    let scammer = null

    let scammerInform = null
    let reviews = []

    if (type === 'phone') {
        const scammerPhone = await ScammerPhone.findOne({ where: { phone: text } })
        if (scammerPhone) {
            scammer = await Scammer.findOne({ where: { id: scammerPhone.scammerID } })
        }
    } else {
        scammer = await Scammer.findOne({ where: { iin: text } })
    }

    if (scammer) {

        /* Scammer names */
        const tempNames = await ScammerName.findAll({ where: { scammerID: scammer.id } })

        /* Scammer Phones */
        const tempPhones = await ScammerPhone.findAll({ where: { scammerID: scammer.id } })

        scammerInform = {
            iin: scammer.iin,
            email: scammer.email,
            phones: tempPhones,
            names: tempNames
        }

        /* Reviews */
        const sql = 'SELECT * FROM Reviews WHERE scammerID = :scammerID'
        const tempReviews = await sequelize.query(sql, { replacements: { scammerID: scammer.id }, type: Sequelize.QueryTypes.SELECT, raw: true })
        // const tempReviews = await Review.findAll({ where: { scammerID: scammer.id } })
        for (const tempReview of tempReviews) {
            const images = await ReviewImage.findAll({ where: { reviewID: tempReview.id } })
            const author = tempReview.anonymously ? null : await User.findOne({ where: { id: tempReview.userID } })
            reviews.push({
                ...tempReview,
                author,
                images
            })
        }
    }

    return res.status(200).json({ scammer: scammerInform, reviews })

})

app.get('/my-reviews', async (req, res) => {
    /* Fields */

    const { id } = req.user

    let scammerInform = null
    let reviews = []

    if (id) {

        /* Reviews */
        const sql = 'SELECT * FROM Reviews WHERE userID = :userID'
        const tempReviews = await sequelize.query(sql, { replacements: { userID: id }, type: Sequelize.QueryTypes.SELECT, raw: true })
        for (const tempReview of tempReviews) {
            const images = await ReviewImage.findAll({ where: { reviewID: tempReview.id } })

            const scammer = await Scammer.findOne({ where: { id: tempReview.userID } })

            reviews.push({
                ...tempReview,
                images
            })
        }
    }

    return res.status(200).json({ scammer: scammerInform, reviews })

})

/* Create Product */
app.post('/create', verifyToken, async (req, res) => {

    const { id } = req.user
    const { name, iin, phone, email, title, description, anonymously } = req.body

    if (!name) {
        return res.status(400).send({
            message: "Invalid parameters"
        })
    }

    const files = req.files ? req.files[`images`] : null
    const path = dirname + "/public/reviews/"

    let reviewData = { name, iin, phone, title, description, anonymously, userID: id }

    /* Get is scammer exists or not */
    // const sql = 'SELECT * FROM ScammerPhone WHERE phone = :phone'
    // const data = await sequelize.query(sql, { replacements: { iin, phone }, type: Sequelize.QueryTypes.SELECT, plain: true })
    let scammer = await Scammer.findOne({ raw: true, where: { iin: iin } })
    let scammerPhone = await ScammerPhone.findOne({ raw: true, where: { phone: phone } })


    if (scammerPhone || scammer) {
        if (scammer) {
            reviewData.scammerID = scammer.id
        } else {
            scammer = await Scammer.findOne({ where: { id: scammerPhone.scammerID } })
            reviewData.scammerID = scammer.id
        }

        const tempName = await sequelize.query('SELECT * FROM ScammerNames WHERE name LIKE :name', { replacements: { name: name }, type: Sequelize.QueryTypes.SELECT, raw: true })
        // const tempName = ScammerName.findOne({ where: { name: { [Op.like]: `%${name}%` } } })
        if (tempName.length === 0) {
            ScammerName.create({ scammerID: reviewData.scammerID, name: name })
        }


        const tempPhone = await sequelize.query('SELECT * FROM ScammerPhones WHERE phone LIKE :phone', { replacements: { phone: phone }, type: Sequelize.QueryTypes.SELECT, raw: true })
        // const tempPhone = ScammerPhone.findOne({ where: { phone: { [Op.like]: `%${phone}%` } } })
        if (tempPhone.length === 0) {
            ScammerPhone.create({ scammerID: reviewData.scammerID, phone: phone })
        }

        return Review.create(reviewData).then(created => {
            if (created) {
                if (files) {
                    console.log(files)
                    files.forEach(file => {
                        console.log(file)
                        let gl = `review-${Date.now()}-${file.name}`

                        return file.mv(`${path}${gl}`, (error) => {
                            if (!error) {
                                console.log({
                                    reviewID: created.id,
                                    image: gl
                                })
                                ReviewImage.create({
                                    reviewID: created.id,
                                    image: gl
                                })
                            } else {
                                console.log(error)
                            }
                        })
                    })
                }

                return res.status(200).send({
                    message: "Successfully created 2"
                })
            } else {
                return res.status(500).send({
                    message: "Internal server error 3"
                })

            }
        }).catch(() => {
            return res.status(500).send({
                message: "Internal server error 4"
            })
        })
    } else {
        await Scammer.create({
            iin,
            email
        }).then(created => {
            if (created) {
                reviewData.scammerID = created.id

                ScammerName.create({ scammerID: created.id, name: name })
                ScammerPhone.create({ scammerID: reviewData.scammerID, phone: phone })

                return Review.create(reviewData).then(created => {
                    if (created) {
                        if (files) {
                            if (files.name) {
                                let gl = `product-${Date.now()}-${files.name}`
                                return files.mv(`${path}${gl}`, (error) => {
                                    
                                    if (!error) {
                                        ReviewImage.create({
                                            reviewID: created.id,
                                            image: gl
                                        })
                                    }
                                })

                            } else {
                                files.forEach(file => {
                                    let gl = `product-${Date.now()}-${file.name}`

                                    return file.mv(`${path}${gl}`, (error) => {
                                        if (!error) {
                                            ReviewImage.create({
                                                reviewID: created.id,
                                                image: gl
                                            })
                                        }
                                    })
                                })
                            }
                        }

                        return res.status(200).send({
                            message: "Successfully created"
                        })
                    } else {
                        return res.status(500).send({
                            message: "Internal server error"
                        })

                    }
                }).catch(() => {
                    return res.status(500).send({
                        message: "Internal server error"
                    })
                })
            } else {
                return res.status(500).send({
                    message: "Internal server error"
                })
            }
        }).catch(() => {
            return res.status(500).send({
                message: "Internal server error"
            })
        })
    }
})

module.exports = app