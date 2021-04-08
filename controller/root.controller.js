const userModel = require('../models/user.model');
const gameModel = require('../models/game.model');
const _ = require('lodash');

createUsersWithTeam = async (req, res) => {
    try {
        let emails = req.body.emails;
        let squad = req.body.squad;
        let teamName = req.body.teamName;
        for (let i = 0; i < emails.length; i++) {
            let user = await userModel.findOne({ email: emails[i] });
            if (user) {
                return res.status(200).jsonp({ status: 403, message: "One of the Email Already Exists" });
            }
        }
        if(emails[0] == emails[1] || emails[0] == emails[2] || emails[1] == emails[2]){
            return res.status(200).jsonp({ status: 403, message: "Emails should be unique" });
        }
        var session = await userModel.startSession();
        await session.withTransaction(async () => {
            for (let i = 0; i < emails.length; i++) {
                let user = new userModel({
                    email: emails[i],
                    rollNo: "110117026",
                    teamName: teamName,
                    squad: squad,
                    isAdmin: false,
                    name: teamName+"-"+i,
                    selectedPlayersForMatch: []
                });
                await user.save();
            }
        })
        session.endSession();
        return res.status(200).jsonp({ status: 200, message: "All Users Added Successfully" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

isLive = async (req, res) => {
    try {
        let status = await gameModel.findOne();
        if (status.isLive) {
            return res.status(200).jsonp({ status: 200, data: true });
        } else {
            return res.status(200).jsonp({ status: 200, data: false });
        }
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

setLive = async (req, res) => {
    try {
        let status = await gameModel.findOne();
        status.isLive = !status.isLive;
        await status.save();
        return res.status(200).jsonp({ status: 200, message: "Status Changed" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

module.exports = {
    createUsersWithTeam: createUsersWithTeam,
    setLive: setLive,
    isLive: isLive,
}