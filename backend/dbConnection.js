const mongoose = require('mongoose');

function dbConnect() {
    const mongoURL = process.env.mongoURL;
    return mongoose.connect(mongoURL)
            .then(() => {console.log("MongoDB Connected")})
            .catch((err) => {console.log("Error ",err)});
}

module.exports = dbConnect;