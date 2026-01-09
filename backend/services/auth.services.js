const jwt = require('jsonwebtoken');

const secret = process.env.jwtSecretKey;

function createToken(user) {
    const token = jwt.sign({
        id : user._id,
        name : user.fullName,
        profileImage: user.profileImageURL,
        role : user.role,
        email : user.email,
        hostel : user.hostel,
        rollNo : user.rollNo,
        room : user.room,
    },secret);

    return token;
}

function validateToken(token) {
    if(!token) return null;
    try {
        return jwt.verify(token,secret);
    }
    catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

module.exports = {createToken,validateToken};