require('dotenv').config();

const jwt = require('jsonwebtoken');

const Player = require('../models/player');

const validateToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "User is not authosized." });
            }
            next();
        });
    } else {
        res.redirect('/log_in');
        // res.status(401).json({ message: "User is not authosized." })
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.token;
    res.locals.player = null;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) { next() };

            const player = await Player.findById(decoded.id);
            res.locals.player = player;
            next();
        });
    } else {
        next();
    }
};

module.exports ={ validateToken, checkUser };