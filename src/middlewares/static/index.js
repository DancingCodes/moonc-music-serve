const express = require('express');
const path = require('path');
const fs = require('fs');
const { network } = require('@/config/serve')

const uploadmusicPath = path.join(process.cwd(), 'src', 'public', 'upload', 'music');
const requestMusicPath = `${network}/music`

const init = (app) => {
    fs.mkdirSync(uploadmusicPath, { recursive: true });
    app.use('/music', express.static(uploadmusicPath));
}
module.exports = {
    uploadmusicPath,
    requestMusicPath,
    init
}