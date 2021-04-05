const rootRouter = require('express').Router();
const userController = require('../controller/user.controller')
const rootController = require('../controller/root.controller')

const utils = require('../utils/utils');

rootRouter.post("/register", 
    userController.register
);

rootRouter.post("/login", 
    userController.login
)

rootRouter.post("/createUsers", 
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    rootController.createUsersWithTeam
)

rootRouter.post("/isLive", 
    utils.initializeLocal,
    userController.checkSession,
    rootController.isLive
)

rootRouter.post("/setLive", 
    utils.initializeLocal,
    userController.checkSession,
    rootController.setLive
)

module.exports = rootRouter;
