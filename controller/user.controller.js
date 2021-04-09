const userModel = require('../models/user.model');
const utils = require('../utils/utils');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const playerModel = require('../models/player.model');
const userMatchModel = require('../models/userMatch.model');
const matchModel = require('../models/match.model');
const saltRounds = 10;


checkTeamSelection = async (selectedPlayers) => {
    try {
        if (selectedPlayers.length > 3) {
            return false;
        }
        let playersCount = {};
        for (let i = 0; i < selectedPlayers.length; i++) {
            let player = await playerModel.findOne({ _id: selectedPlayers[i] });
            playersCount[player.teamName] = playersCount[player.teamName] ? playersCount[player.teamName] + 1 : 1;
        }
        for (let teamName in playersCount) {
            if (playersCount.teamName > 2) {
                return false;
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

checkSession = async (req, res, next) => {
    try {
        if (!req.body.session)
            return res.status(200).jsonp({ status: 403, message: "User not Logged In" });
        let user = await userModel.findOne({ session: req.body.session });
        if (!user) {
            return res.status(200).jsonp({ status: 403, message: "Invalid Session" });
        }
        req.locals.user = user;
        return next();
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

checkAdmin = async (req, res, next) => {
    try {
        let user = req.locals.user;
        if (!user.isAdmin) {
            return res.status(200).jsonp({ status: 403, message: "You are Not Authorized" });
        }
        return next();
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

register = async (req, res) => {
    try {
        let hashedPass = await bcrypt.hash(req.body.password, saltRounds);
        let user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).jsonp({ status: 403, message: "You are Not Authorized" });
        } else if (user && user.password !== "") {
            return res.status(200).jsonp({ status: 403, message: "User Already Exists" });
        }
        user.password = hashedPass;
        user.name = req.body.name;
        user.contact = req.body.contact;
        user.isAdmin = false;
        await user.save();
        res.status(200).jsonp({ status: 200, message: "Registration Successfull" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(200).jsonp({ status: 403, message: "User Not Found" });
        }
        let matches = await bcrypt.compare(password, user.password);
        if (matches) {
            let session = await utils.generateRandomString(16);
            user.session = session;
            await user.save();
            return res.status(200).jsonp({ status: 200, message: "Login Successfully", user: user });
        } else {
            return res.status(200).jsonp({ status: 403, message: "Password Incorrect" });
        }
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

setTeam = async (req, res) => {
    try {
        let user = req.locals.user;
        let selectedPlayers = req.body.selectedPlayers;
        let starPlayer = req.body.starPlayer;
        if(!starPlayer || starPlayer===""){
            return res.status(200).jsonp({ status: 403, message: "Please Select A Star Player" });
        }
        if (!checkTeamSelection(selectedPlayers)) {
            return res.status(200).jsonp({ status: 403, message: "You can pick maximum 3 players, not all from the same team" });
        }
        let matchId = req.body.matchId;
        let userMatch = await userMatchModel.findOne({ userId: user._id, matchId: matchId });
        let match = await matchModel.findOne({_id: matchId});
        if(match.isLive) {
            return res.status(200).jsonp({ status: 403, message: "Sorry, The Match has Started, You can't pick team now." });
        }
        if (userMatch) await userMatchModel.deleteOne({ _id: userMatch._id });
        userMatch = new userMatchModel({
            userId: user._id,
            matchId: matchId,
            squad: selectedPlayers,
            pointsTaken: 0,
            starPlayer: starPlayer,
        })
        await userMatch.save();
        return res.status(200).jsonp({ status: 200, message: "Team Has been Successfully Set" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

setSquad = async (req, res) => {
    try {
        let user = req.locals.user;
        let squad = req.body.squad;
        user.squad = squad;
        await user.save();
        return res.status(200).jsonp({ status: 200, message: "Squad Has been Successfully Set" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

getUserData = async (req, res) => {
    try {
        let user = req.locals.user;
        return res.status(200).jsonp({ status: 200, user: user });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

getAllUsers = async (req, res) => {
    try {
        let withTeam = req.body.withTeam;
        let users;
        if (withTeam)
            users = await userModel.find({isAdmin: false});
        else
            users = await userModel.find({ squad: [] });
        return res.status(200).jsonp({ status: 200, data: users });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

getPlayersForMatch = async (req, res) => {
    try {
        let user = req.locals.user;
        let matchId = req.body.matchId;
        if (!matchId) {
            return res.status(200).jsonp({ status: 200, data: [] });
        }
        let userMatch = await userMatchModel.findOne({ userId: user._id, matchId: matchId });
        if (!userMatch) return res.status(200).jsonp({ status: 200, data: [] });
        return res.status(200).jsonp({ status: 200, data: userMatch.squad, starPlayer: userMatch.starPlayer });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}


module.exports = {
    register: register,
    login: login,
    checkSession: checkSession,
    checkAdmin: checkAdmin,
    setTeam: setTeam,
    setSquad: setSquad,
    getUserData: getUserData,
    getAllUsers: getAllUsers,
    getPlayersForMatch: getPlayersForMatch
}