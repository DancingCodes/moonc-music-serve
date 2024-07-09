const app = require('@/app')
const consoleLog = require('@/utils/consoleLog')
const fs = require('fs')
const path = require('path');

const network = {
    port: 3003,
    host: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1' : "https://music.moonc.love",
};


if (process.env.NODE_ENV === 'development') {
    app.listen(network.port, () => {
        consoleLog.success(`${network.host}:${network.port}`)
        consoleLog.success(`Http服务已启动`)
    });
} else {
    require('https').createServer({
        key: fs.readFileSync(path.join(process.cwd(), 'config', 'serve', 'ssl', 'key.key')),
        cert: fs.readFileSync(path.join(process.cwd(), 'config', 'serve', 'ssl', 'crt.crt'))
    }, app).listen(network.port, () => {
        consoleLog.success(`${network.host}:${network.port}`)
        consoleLog.success(`Https服务已启动`)
    });
}

module.exports = network;