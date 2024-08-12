const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')

/* Routes */
const routes = require('./routes')

/* Express */
const app = express()
const server = http.createServer(app)


/* Fields */
const PORT = 8002

/* Set options */
app.use(cors({ origin: true, credentials: true }))
app.use(fileUpload())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use(express.json({  extended: true }));
app.use(express.urlencoded({  extended: true }));

/* Static files */
app.use(express.static('public'))

/* Index route */
app.get("/", (req, res) => {
    return res.json({
        message: "Backend project for Moshenniki.kz",
        version: "1.0.0"
    })
})

app.use(routes)

app.use((req, res) => {
    return res.status(404).send({
        error: "Page not found",
        code: 404
    })
})

/* Start server */
server.listen(PORT, () => {
    console.log(`CRM app listening on port ${PORT}`)
})