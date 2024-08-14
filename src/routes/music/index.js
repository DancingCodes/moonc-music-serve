const express = require('express');
const router = express.Router();

const musicController = require('@/controllers/music');

// Moonc - Music - Serve - Ui
router.get('/searchMusicByWY', musicController.searchMusicByWY)

router.get('/saveMusic', musicController.saveMusic)

// Moonc - Music - Pc
router.get('/searchMusic', musicController.searchMusic)


module.exports = router;