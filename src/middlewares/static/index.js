const express = require('express');
const path = require('path');
const fs = require('fs');
const { port } = require('@/config/serve')

const uploadmusicPath = path.join(process.cwd(), 'src', 'public', 'upload', 'music');
const baseUrl = process.env.NODE_ENV === 'development' ? `http://127.0.0.1:${port}` : 'https://music.moonc.love'
const requestMusicPath = `${baseUrl}/music`

const init = (app) => {
    fs.mkdirSync(uploadmusicPath, { recursive: true });
    app.use('/music', express.static(uploadmusicPath));
}
module.exports = {
    uploadmusicPath,
    requestMusicPath,
    init
}