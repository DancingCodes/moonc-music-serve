function createBody(status, data, message) {
    return {
        status: status,
        data: data,
        message: message
    };
}

const response = {
    success: (data = null) => {
        return createBody(200, data, 'success')
    },
    error: (message = 'error') => {
        return createBody(500, null, message)
    }
}


module.exports = response