const express = require('express');
const router = express.Router();

const musicController = require('@/controllers/music');

router.get('/searchMusic', musicController.searchMusic)

router.get('/saveMusic', musicController.saveMusic)

module.exports = router;