const userRouter = require('express').Router();
const matchController = require('../controller/match.controller');
const userController = require('../controller/user.controller');
const utils = require("../utils/utils");

userRouter.post("/setPlayersForMatch",
    utils.initializeLocal,
    userController.checkSession,
    userController.setTeam
);

userRouter.post("/setTeam",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    userController.setSquad
)

userRouter.post("/getUserData",
    utils.initializeLocal,
    userController.checkSession,
    userController.getUserData
)

userRouter.post("/getAllUsers",
    utils.initializeLocal,
    userController.checkSession,
    userController.getAllUsers,
)

userRouter.post("/getPlayersForMatch",
    utils.initializeLocal,
    userController.checkSession,
    userController.getPlayersForMatch,
)

userRouter.post("/getSquadForUserMatch",
    utils.initializeLocal,
    userController.checkSession,
    userController.checkAdmin,
    userController.getPlayerForMatchForUser
)

userRouter.post("/getPosition",
    utils.initializeLocal,
    userController.checkSession,
    userController.getPosition,
)

module.exports = userRouter;
