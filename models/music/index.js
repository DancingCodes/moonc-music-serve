const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    id: String,
    name: String,
    url: String,
    author: Array,
    album: Object,
    lyric: String,
})
const Music = mongoose.model('music', musicSchema);

module.exports = Music