const express = require('express')
const app = express()
module.exports = app;

require('module-alias').addAlias('@', process.cwd());

require('@/config');

require('@/routes');