module.exports.generateRandomString = (length) => {
    randomString = crypto.randomBytes(length).toString('hex');
    return randomString.substr(0, length);
}

module.exports.initializeLocal = (req, res, next) => {
    if (!req.locals) {
        req.locals = {};
    }
    next();
}