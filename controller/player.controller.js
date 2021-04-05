const playerModel = require('../models/player.model');
const _ = require('lodash');

addPlayer = async (req, res, next) => {
    let player = new playerModel({
        name : req.body.playerName, 
        teamName : req.body.playerTeam,
        totalPoints: 0,
    })
    await player.save();
    return res.status(200).jsonp({status:200, message: "Sucessfully Added"});
}

updatePlayerPts = async (req,res,next) => {
    let player = await playerModel.findOne({id:req.body.playerId});

    if(!player){
        return res.status(200).jsonp({message: "No such Player"});
    }

    player.totalPoints += req.body.points;
    return res.status(200).jsonp({status:200, message: "Added Successfully"});

}

getTeamSquad = async (req, res) => {
    let teamName = req.body.teamName;
    let data = await playerModel.find({teamName: teamName});
    return res.status(200).jsonp({status: 200, data: data})
}

getPlayers = async (req, res) => {
    let data = [];
    let reqId = req.body.playerIds;
    for(let i=0;i<reqId.length;i++){
        let player = await playerModel.findOne({_id:reqId[i]});
        data.push(player);
    }
    return res.status(200).jsonp({status: 200, data: data})
}

getAllPlayers = async (req, res) => {
    let data = await playerModel.find();
    return res.status(200).jsonp({status: 200, data: data});
}

module.exports = {
    addPlayer: addPlayer,
    updatePlayerPts: updatePlayerPts,
    getTeamSquad: getTeamSquad,
    getPlayers: getPlayers,
    getAllPlayers: getAllPlayers,
}