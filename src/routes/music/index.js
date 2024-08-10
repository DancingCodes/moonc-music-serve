const express = require('express');
const router = express.Router();

const musicController = require('@/controllers/music');

// Moonc - Music - Serve - Ui
router.get('/searchMusicForWY', musicController.searchMusicForWY)

router.get('/saveMusic', musicController.saveMusic)

// Moonc - Music - Pc
router.get('/searchMusic', musicController.searchMusic)


module.exports = router;