const consoleLog = require('@/utils/consoleLog')
const fs = require('fs')
const path = require('path');


const port = 3003
const network = process.env.NODE_ENV === 'development' ? `http://127.0.0.1:${port}` : "https://music.moonc.love"


const init = (app) => {
    if (process.env.NODE_ENV === 'development') {
        app.listen(port, () => {
            consoleLog.success(network)
            consoleLog.success(`Http服务已启动`)
        });
    } else {
        require('https').createServer({
            key: fs.readFileSync(path.join(__filename, 'ssl', 'key.key')),
            cert: fs.readFileSync(path.join(__filename, 'ssl', 'crt.crt'))
        }, app).listen(port, () => {
            consoleLog.success(network)
            consoleLog.success(`Https服务已启动`)
        });
    }
}

module.exports = {
    port,
    network,
    init
}