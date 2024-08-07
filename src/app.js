const express = require('express')
const app = express()

require('module-alias/register')

require('@/config')(app)

require('@/middlewares')(app)

require('@/routes')(app)