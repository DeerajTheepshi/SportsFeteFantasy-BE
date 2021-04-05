const matchRouter = require('express').Router();
const matchController = require('../controller/match.controller');
const userController = require('../controller/user.controller');
const utils = require('../utils/utils')

matchRouter.post("/createMatch",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    matchController.createMatch
)

matchRouter.post("/updatePlaying11",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    matchController.updatePlaying11
)

matchRouter.post("/updateScoresForMatch",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    matchController.updatePtsForMatch
)

matchRouter.post("/getAllMatches",
    utils.initializeLocal,
    userController.checkSession,
    matchController.getAllMatches
)

matchRouter.post("/toggleLive",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    matchController.toggleLive,
)

matchRouter.post("/simulate",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    matchController.simulateMatch,
)

matchRouter.post("/getNotLiveMatches",
    utils.initializeLocal,
    userController.checkSession,
    matchController.getNotLiveMatches
)

matchRouter.post("/undoSimulation",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    matchController.undoSimulation
)

module.exports = matchRouter;
