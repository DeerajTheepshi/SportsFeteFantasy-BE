const rootRouter = require('express').Router();
const userController = require('../controller/user.controller')
const utils = require('../utils/utils');

rootRouter.post("/register", 
    userController.register
);

rootRouter.post("/login", 
    userController.login
)


module.exports = rootRouter;
