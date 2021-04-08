const playerRouter = require('express').Router();
const playerController = require('../controller/player.controller');
const userController = require('../controller/user.controller');
const utils = require('../utils/utils')

playerRouter.post("/addPlayer", 
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    playerController.addPlayer
);

playerRouter.post("/updatePlayerPts",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    playerController.updatePlayerPts
);

playerRouter.post("/getTeamSquad", 
    utils.initializeLocal,
    userController.checkSession,
    playerController.getTeamSquad
)

playerRouter.post("/getPlayers",
    utils.initializeLocal,
    userController.checkSession,
    playerController.getPlayers,
)

playerRouter.post("/getTeamPlayers",
    utils.initializeLocal,
    userController.checkSession,
    playerController.getTeamPlayers,
)

playerRouter.post("/getAllPlayers",
    utils.initializeLocal,
    userController.checkSession,
    playerController.getAllPlayers
)

module.exports = playerRouter;
