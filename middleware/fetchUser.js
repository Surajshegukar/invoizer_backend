const jwt = require('jsonwebtoken');
// require('dotenv').config();

const JWT_Secret = 'your_secret_key';
// console.log(JWT_Secret);


const fetchUser = async (req, res, next) => {
    // Get user from database
    const token = req.header("authorization");
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using valid token" });
    }
    if (token.expiresIn < Date.now()) {
        return res.status(401).send({ error: "Token expired" });
    }
    try {
        const data = jwt.verify(token,JWT_Secret);
        req.id = data.id;
        next();
        
    } catch (error) {
        return res.status(401).send({ error: error.message });
    }
}

module.exports = fetchUser;