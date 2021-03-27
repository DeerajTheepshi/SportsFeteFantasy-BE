const playerModel = require('../models/player.model');
const _ = require('lodash');

addPlayer = async (req, res, next) => {
    let player = new playerModel({
        name : req.body.playerName, 
        teamName : req.body.teamName,
        totalPoints: 0,
    })
    await playerModel.save();
    return res.status(200).jsonp({message: "Sucessfully Added"});
}

updatePlayerPts = async (req,res,next) => {
    let player = await playerModel.findOne({id:req.body.playerId});

    if(!player){
        return res.status(200).jsonp({message: "No such Player"});
    }

    player.totalPoints += req.body.points;
    return res.status(200).jsonp({message: "Added Successfully"});

}

module.exports = {
    addPlayer: addPlayer,
    updatePlayerPts: updatePlayerPts
}