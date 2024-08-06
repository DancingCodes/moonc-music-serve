const Music = require('@/models/music')

const createMusic = async (music) => await new Music(music).save()
const getMusic = async (id) => await Music.findOne({ id })

module.exports = {
    createMusic,
    getMusic
};