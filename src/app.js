const express = require('express')
const app = express()
module.exports = app;

require('module-alias/register')

require('@/config')(app)

require('@/middlewares')(app)

require('@/routes')(app)