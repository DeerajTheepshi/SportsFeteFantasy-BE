const playerModel = require('../models/player.model');
const _ = require('lodash');

addPlayer = async (req, res, next) => {
    try {
        let player = new playerModel({
            name: req.body.playerName,
            teamName: req.body.playerTeam,
            totalPoints: 0,
        })
        await player.save();
        return res.status(200).jsonp({ status: 200, message: "Sucessfully Added" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

updatePlayerPts = async (req, res, next) => {
    try {
        let player = await playerModel.findOne({ id: req.body.playerId });

        if (!player) {
            return res.status(200).jsonp({ message: "No such Player" });
        }

        player.totalPoints += req.body.points;
        return res.status(200).jsonp({ status: 200, message: "Added Successfully" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }

}

getTeamSquad = async (req, res) => {
    try {
        let teamName = req.body.teamName;
        let data = await playerModel.find({ teamName: teamName });
        return res.status(200).jsonp({ status: 200, data: data })
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

getPlayers = async (req, res) => {
    try {
        let data = [];
        let reqId = req.body.playerIds;
        for (let i = 0; i < reqId.length; i++) {
            let player = await playerModel.findOne({ _id: reqId[i] });
            data.push(player);
        }
        return res.status(200).jsonp({ status: 200, data: data })
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

getTeamPlayers = async (req, res) => {
    try {
        let teamName = req.body.teamName;
        let data = await playerModel.find({teamName: teamName})        
        return res.status(200).jsonp({ status: 200, data: data })
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

getAllPlayers = async (req, res) => {
    try {
        let data = await playerModel.find();
        return res.status(200).jsonp({ status: 200, data: data });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

module.exports = {
    addPlayer: addPlayer,
    updatePlayerPts: updatePlayerPts,
    getTeamSquad: getTeamSquad,
    getPlayers: getPlayers,
    getAllPlayers: getAllPlayers,
    getTeamPlayers: getTeamPlayers
}