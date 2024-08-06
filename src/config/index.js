module.exports = (app) => {
    require('@/config/database');

    require('@/config/serve')(app)
}