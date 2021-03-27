const playerRouter = require('express').Router();
const playerController = require('../controller/player.controller');
const userController = require('../controller/user.controller');

playerRouter.post("/addPlayer", 
    userController.checkSession,
    userController.checkAdmin,
    playerController.addPlayer
);

playerRouter.post("/updatePlayerPts",
    userController.checkSession,
    userController.checkAdmin,
    playerController.updatePlayerPts
);
