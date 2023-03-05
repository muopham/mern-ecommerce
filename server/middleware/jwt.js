const jwt = require('jsonwebtoken')

const generateAccessToken = (uid, role) => jwt.sign({ _id: uid, role }, process.env.JWT_SECRET_ACCESS, { expiresIn: '3d' })
const generateRefreshToken = (uid) => jwt.sign({ _id: uid }, process.env.JWT_SECRET_REFRESH, { expiresIn: '7d' })


module.exports = {
    generateAccessToken,
    generateRefreshToken
}