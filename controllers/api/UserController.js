const express = require('express')
const app = express.Router()

/* JWT and BCrypt */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

/* FS and PATH */
const fs = require('fs')
const path = require('path')

/* UUID */
const { v4: uuidv4 } = require('uuid')

/* Models */
const { User } = require('../../db/models')

/* Keys */
const PRIVATE_KEY = fs.readFileSync(path.resolve('config/user/private.key'), 'utf8')

/* Middleware */
const verifyToken = require("../../middleware/UserAuthorization")

/* LOGIN */
app.post("/login", (request, response) => {

    /* Fields */
    const { email, password } = request.body

    /* Validate */
    if (!email || !password) {
        return response.status(400).send({ message: "Invalid parameters" })
    }


    /* Find User */
    return User.findOne({ where: { email } }).then(user => {


        /* Checking if exists */
        if (!user) {
            return response.status(404).send({ message: "User not found" })
        }

        /* Check password */
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return response.status(401).send({ message: "Invalid Password!" })
        }

        /* Generate token */
        return jwt.sign({ id: user.id, name: user.name, email: user.email, token: user.token }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: "7d" }, (error, sign) => {

            if (error) {
                return response.status(500).send({ message: "Internal server error" })
            }

            return response.status(200).send({ token: sign })
        })

    }).catch((e) => {
        console.log(e)
        return response.status(500).send({ message: "Internal server error" })
    })

})

/* REGISTRATION */
app.post("/registration", (request, response) => {

    /* Fields */
    const { name, email, password } = request.body

    /* Validate */
    if (!name || !email || !password) {
        return response.status(400).send({ message: "Invalid parameters" })
    }

    /* Find User */
    return User.findOne({ where: { email } }).then(user => {

        /* Checking if exists */
        if (user) {
            return response.status(401).send({ message: "User exists" })
        }

        /* Create User */
        return User.create({ name, email, password: bcrypt.hashSync(password, 8), token: uuidv4() }).then(created => {
            if (created) {

                /* Generate token */
                return jwt.sign({ id: created.id, name: created.name, email: created.email, token: created.token }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: "7d" }, (error, sign) => {

                    if (error) {
                        return response.status(500).send({ message: "Internal server error" })
                    }

                    return response.status(200).send({ token: sign })
                })
            }
            else {
                return response.status(500).send({ message: "Internal server error" })
            }
        }).catch(() => {
            return response.status(500).send({ message: "Internal server error" })
        })
    }).catch(() => {
        return response.status(500).send({ message: "Internal server error" })
    })

})

app.get("/get", verifyToken, async (request, response) => {

    const { id } = request.user

    /* Validate */
    if (!id) {
        return response.status(400).send({ message: "Invalid parameters" })
    }

    return User.findOne({ where: { id } }).then(user => {
        if (user) {
            return response.status(200).send({
                name: user.name,
                email: user.email,
                phone: user.phone,
                iin: user.iin
            })
        }
        else {
            return response.status(500).send({ message: "Internal server error" })
        }
    }).catch(() => {
        return response.status(500).send({ message: "Internal server error" })
    })
})


/* EDIT USER */
app.post("/edit", verifyToken, async (request, response) => {

    const { id } = request.user
    const { name, email, iin, phone } = request.body

    /* Validate */
    if (!id || !name) {
        return response.status(400).send({ message: "Invalid parameters" })
    }

    return User.update({ name, email, phone, iin }, { where: { id } }).then(updated => {
        if (updated) {

            return User.findOne({ where: { id } }).then(user => {
                if (user) {

                    /* Generate token */
                    return jwt.sign({ id: user.id, name: user.name, iin: user.iin, email: user.email, token: user.token }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: "7d" }, (error, sign) => {

                        if (error) {
                            return response.status(500).send({ message: "Internal server error" })
                        }

                        return response.status(200).send({ token: sign })
                    })

                }
                else {
                    return response.status(500).send({ message: "Internal server error" })
                }
            }).catch(() => {
                return response.status(500).send({ message: "Internal server error" })
            })

        }
        else {
            return response.status(500).send({ message: "Internal server error" })
        }
    }).catch(() => {
        return response.status(500).send({ message: "Internal server error" })
    })
})

/* CHANGE PASSWORD */
app.post("/password", verifyToken, async (req, res) => {

    const { id } = req.user
    const { password, newPassword } = req.body

    /* Validate */
    if (!id || !password || !newPassword) {
        return res.status(400).send({ message: "Invalid parameters" })
    }

    /* Find User */
    return User.findOne({ where: { id } }).then(user => {

        /* Checking if exists */
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }

        /* Check password */
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password!" })
        }

        /* Change Password */
        return User.update({ password: bcrypt.hashSync(newPassword, 8) }, { where: { id } }).then(updated => {
            if (updated) {
                return res.status(200).send({ message: "Password changed successfully" })
            }
            else {
                return res.status(500).send({ message: "Internal server error" })
            }
        }).catch(() => {
            return res.status(500).send({ message: "Internal server error" })
        })

    }).catch(() => {
        return res.status(500).send({ message: "Internal server error" })
    })

})

module.exports = app