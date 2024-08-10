const Music = require('@/models/music')

const createMusic = async (music) => await new Music(music).save()
const getMusic = async (id) => await Music.findOne({ id })
const getMusicList = async (name, pageNo, pageSize) => {
    const query = name ? { name: new RegExp(name, 'i') } : {};

    const list = await Music.find(query).select('-_id -__v').skip((pageNo - 1) * pageSize).limit(pageSize);
    const total = await Music.find(query).countDocuments();
    return {
        list,
        total
    }
}

module.exports = {
    createMusic,
    getMusic,
    getMusicList
};