const express = require('express');
const router = express.Router();

const musicController = require('@/controllers/music');

router.get('/searchMusicForWY', musicController.searchMusicForWY)

router.get('/saveMusic', musicController.saveMusic)

module.exports = router;