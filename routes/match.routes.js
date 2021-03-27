const matchRouter = require('express').Router();
const matchController = require('../controller/match.controller');
const userController = require('../controller/user.controller');

matchRouter.post("/createMatch",
    userController.checkSession,
    userController.checkAdmin,
    matchController.createMatch
)

matchRouter.post("/updatePlaying11",
    userController.checkSession,
    userController.checkAdmin,
    matchController.updatePlaying11
)

matchRouter.post("/updateScoresForMatch",
    userController.checkSession,
    userController.checkAdmin,
    matchController.updatePtsForMatch
)
