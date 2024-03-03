const express = require('express')
const router = require('./routers')

const path = require("path")
require('dotenv/config')
const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "/login.html"))
})


//Midllewares
app.use(express.json({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use('/api', router)


app.use('/images', express.static('../begüm-kds/public/images/reklam.jpg'));
app.listen(process.env.PORT)