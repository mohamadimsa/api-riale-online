const db = require('$db');

class Kraaken {

    async captureError(err) {
        return await db.kraaken.create({
            data: {
                message: err.message || err.toString() || 'failed to log error',
                date: new Date(),
            }
        })
    }
}

module.exports = Kraaken;