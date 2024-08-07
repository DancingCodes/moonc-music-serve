const express = require('express');
const path = require('path');
const fs = require('fs');

const uploadmusicPath = path.join(process.cwd(), 'src', 'public', 'upload', 'music');

const init = (app) => {
    fs.mkdirSync(uploadmusicPath, { recursive: true });
    app.use('/uploadImage', express.static(uploadmusicPath));
}
module.exports = {
    uploadmusicPath,
    init
}