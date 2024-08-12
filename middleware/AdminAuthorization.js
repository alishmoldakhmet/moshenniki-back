const jwt = require("jsonwebtoken")

/* FS and PATH */
const fs = require("fs")
const path = require('path')

/* Keys */
const PUBLIC_KEY = fs.readFileSync(path.resolve('config/admin/public.key'), 'utf8')


/* Manager Verify Token */
const verifyToken = (request, response, next) => {

    const bearerHeader = request.headers['authorization']

    if (bearerHeader) {

        const bearer = bearerHeader.split(' ')
        const token = bearer[1]

        jwt.verify(token, PUBLIC_KEY, (error, data) => {
            if (error) {
                return response.status(401).send({ message: "Unauthorized" })
            }
            else {
                request.token = token
                request.admin = data
                next()
            }
        })
        
    }
    else {
        return response.status(401).send({ message: "Unauthorized" })
    }
}

module.exports = verifyToken