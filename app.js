const express = require('express')
const app = express()

// 工具类
const path = require('path')
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');


// 服务
const port = 3003
if (process.env.NODE_ENV === 'development') {
    app.listen(port, () => {
        console.log('HTTP 服务器启动成功');
    });
} else {
    const https = require('https')
    https.createServer({
        key: fs.readFileSync('./ssl/key.key'),
        cert: fs.readFileSync('./ssl/crt.crt')
    }, app).listen(port, () => {
        console.log('Https服务器启动成功')
    });
}

// 数据库
mongoose.connect('mongodb://MooncMusic:123456@127.0.0.1:27017/MooncMusic?authSource=MooncMusic').then(
    () => {
        console.log('数据库连接成功')
    },
    err => {
        console.log('数据库连接失败')
    }
)

const musicSchema = new mongoose.Schema({
    id: String,
    name: String,
    url: String,
    author: Array,
    album: Object,
    lyric: String,
})
const Music = mongoose.model('music', musicSchema);


// 创建文件夹
if (!fs.existsSync(path.join(__dirname, 'musicFile'))) {
    fs.mkdirSync(path.join(__dirname, 'musicFile'));
}

// 开放静态资源
app.use('/musicFile', express.static(path.join(process.cwd(), 'musicFile')));


// 接口
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'))
})

app.get('/searchMusic', async (req, res) => {
    const { name, offset, limit } = req.query
    const { data } = await axios.post(`https://music.163.com/api/search/get/web?s=${name}&type=1&offset=${offset}&limit=${limit}`)
    res.send(data)
})

app.get('/saveMusic', async (req, res) => {
    const { id } = req.query
    if (!id) {
        res.send('没有获取到ID')
    }

    // 获取歌曲文件流
    const musicFile = await axios({
        url: `http://music.163.com/song/media/outer/url?id=${id}.mp3`,
        method: 'get',
        responseType: 'stream'
    })


    if (musicFile.headers['content-type'].startsWith('text/html')) {
        res.send('VIP音乐无法下载')
        return
    }


    if (await Music.findOne({ id })) {
        res.send('已有该音乐')
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
        url: `${baseUrl}/musicFile/${song.id}.mp3`,
        author: song.ar.map(item => ({ id: item.id, name: item.name })),
        album: {
            id: song.al.id,
            name: song.al.name,
            picUrl: song.al.picUrl,
        },
        lyric: musicLyric.data.lrc.lyric
    }

    // 入库
    await new Music(music).save()

    // 保存至本地
    const writer = fs.createWriteStream(`musicFile/${music.name}.mp3`);
    musicFile.data.pipe(writer);

    writer.on('finish', () => {
        res.send(true);
    });
})