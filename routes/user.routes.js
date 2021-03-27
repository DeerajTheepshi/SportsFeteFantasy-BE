const userRouter = require('express').Router();
const matchController = require('../controller/match.controller');
const userController = require('../controller/user.controller');

userRouter.post("/setTeam",
    userController.checkSession,
    userController.checkAdmin,
    userController.setTeam
);

userRouter.post("/setTeam",
    userController.checkSession,
    userController.checkAdmin,
    userController.setSquad
)