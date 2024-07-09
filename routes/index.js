const app = require('@/app');

// 格式化body
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// 接口
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'))
})
app.use('/music', require('@/routes/music'));