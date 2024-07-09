const express = require('express');
const path = require('path');
const fs = require('fs');
const app = require('@/app')


// 开放用户上传的文件
const musicFilePath = path.join(process.cwd(), 'public', 'musicFile');
fs.mkdirSync(musicFilePath, { recursive: true });
app.use('/musicFile', express.static(musicFilePath));

module.exports = musicFilePath;