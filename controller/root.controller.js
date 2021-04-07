const userModel = require('../models/user.model');
const gameModel = require('../models/game.model');
const _ = require('lodash');

createUsersWithTeam = async (req, res) => {
    let emails = req.body.emails;
    let squad = req.body.squad;
    let teamName = req.body.teamName;
    for(let i=0;i<emails.length;i++){
        let user = new userModel({
            email: emails[i],
            rollNo: "110117026",
            teamName : teamName,
            squad: squad,
            isAdmin: false,
            name: "Unamed",
            selectedPlayersForMatch : []
        });
        await user.save();
    }
    return res.status(200).jsonp({status : 200 , message:"All Users Added Successfully"});
}

isLive = async (req, res) => {
    let status = await gameModel.findOne();
    if(status.isLive){
        return res.status(200).jsonp({status : 200 , data:true});
    } else {
        return res.status(200).jsonp({status : 200 , data:false});
    }
}

setLive = async (req, res) => {
    let status = await gameModel.findOne();
    status.isLive = !status.isLive;
    await status.save();
    return res.status(200).jsonp({status : 200 , message:"Status Changed"});

}

module.exports = {
    createUsersWithTeam: createUsersWithTeam,
    setLive: setLive,
    isLive: isLive,
}