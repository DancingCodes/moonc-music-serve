const musicService = require('@/services/music')
const response = require('@/utils/response')
const axios = require('axios');
const { port } = require('@/config/serve')
const fs = require('fs')
const { uploadmusicPath } = require('@/middlewares/static')
const path = require('path');

async function searchMusicForWY(req, res) {
    const { name, pageNo = 1, pageSize = 10 } = req.query

    if (!name) {
        res.send(response.error('没有获取到歌曲名称'))
        return
    }


    const { data } = await axios.post(`https://music.163.com/api/search/get/web?s=${name}&type=1&offset=${(pageNo - 1) * pageSize}&limit=${pageSize}`)

    let { songs: list, songCount: total } = data.result

    list = list.map(item => {
        return {
            id: item.id,
            name: item.name,
            author: item.artists.map(author => author.name)
        }
    })

    res.send(response.success({ list, total }))
}

async function saveMusic(req, res) {
    const { id } = req.query
    if (!id) {
        res.send(response.error('没有获取到ID'))
        return
    }
    if (await musicService.getMusic(id)) {
        res.send(response.error('已有该音乐'))
        return
    }


    // 获取歌曲文件流
    const musicFile = await axios({
        url: `http://music.163.com/song/media/outer/url?id=${id}.mp3`,
        method: 'get',
        responseType: 'stream'
    })


    if (musicFile.headers['content-type'].startsWith('text/html')) {
        res.send(response.error('VIP音乐无法下载'))
        return
    }




    // 获取歌曲信息
    const musicDetail = await axios.post(`https://music.163.com/api/v3/song/detail?id=${id}&c=[{id: ${id}}]`)


    // 获取歌词信息
    const musicLyric = await axios.post(`https://music.163.com/api/song/lyric?id=${id}&lv=-1&tv=-1`)

    // 整合信息
    const baseUrl = process.env.NODE_ENV === 'development' ? `http://127.0.0.1:${port}` : 'https://music.moonc.love'
    const song = musicDetail.data.songs[0]
    const music = {
        id: song.id,
        name: song.name,
        url: `${baseUrl}/${song.id}.mp3`,
        author: song.ar.map(item => ({ id: item.id, name: item.name })),
        duration: song.dt,
        album: {
            id: song.al.id,
            name: song.al.name,
            picUrl: song.al.picUrl,
        },
        lyric: musicLyric.data.lrc.lyric
    }


    // 保存至本地
    const writer = fs.createWriteStream(path.join(uploadmusicPath, `${music.name}.mp3`));
    musicFile.data.pipe(writer);

    writer.on('finish', async () => {
        // 入库
        await musicService.createMusic(music)

        res.send(response.success(true))
    });
}

module.exports = {
    searchMusicForWY,
    saveMusic
};
