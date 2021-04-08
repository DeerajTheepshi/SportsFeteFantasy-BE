const matchController = require('../controller/match.controller');
const matchModel = require('../models/match.model');
const matchPointModel = require('../models/matchpoint.model');
const playerModel = require('../models/player.model');
const userModel = require('../models/user.model');
const userMatchModel = require('../models/userMatch.model');

createMatch = async (req, res) => {
    try {
        let match = new matchModel({
            matchNo: req.body.matchNo,
            homeTeam: req.body.homeTeamName,
            awayTeam: req.body.awayTeamName,
            homeEleven: req.body.home11s,
            awayEleven: req.body.away11s,
            isLive: false,
        })
        await match.save()
        return res.status(200).jsonp({ status: 200, message: "Created Successfully" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
};

updatePlaying11 = async (req, res) => {
    try {
        let home11Ids = req.body.homeTeam;
        let awa11Ids = req.body.awayTeam;
        let match = matchModel.findOne({ matchNo: req.body.matchNo });

        for (let id in home11Ids) {
            match.homeEleven.push(id);
        }

        for (let id in away11Ids) {
            match.awayEleven.push(id);
        }

        await match.save()
        return res.status(200).jsonp({ status: 200, message: "Updated Successfully" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

updatePtsForMatch = async (req, res) => {
    try {
        let ptsDetails = req.body.ptsDetails;
        let playerDetails = req.body.playerDetails;
        let matchId = req.body.matchId;
        var session = await matchPointModel.startSession();
        await session.withTransaction(async () => {
            let matchPoints = await matchPointModel.find({ matchId: matchId });

            //remove existing data
            for (let i = 0; i < matchPoints.length; i++) {
                await matchPointModel.deleteOne({ _id: matchPoints[i]._id });
            }
            for (let i = 0; i < ptsDetails.length; i++) {
                let playerId = playerDetails[i]._id;
                let playerPts = ptsDetails[i];

                let matchPoint = new matchPointModel({
                    matchId: matchId,
                    playerId: playerId,
                    points: playerPts
                });
                await matchPoint.save();
            }
        })
        session.endSession();
        session = await playerModel.startSession();
        await session.withTransaction(async () => {
            for (let i = 0; i < playerDetails.length; i++) {
                let player = await playerModel.findOne({ _id: playerDetails[i]._id });
                let playerPts = ptsDetails[i];
                player.totalPoints += playerPts;
                await player.save();
            }
        })
        session.endSession();
        res.status(200).jsonp({ status: 200, message: "Points Updated Successfully" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

getAllMatches = async (req, res) => {
    try {
        let data = await matchModel.find();
        let modData = [];
        for (let i = 0; i < data.length; i++) {
            let match = data[i];
            let scored = {};
            let matchPoint = await matchPointModel.findOne({ matchId: match._id });
            if (matchPoint != null) {
                scored = true;
            } else {
                scored = false;
            }
            modData.push({ match, scored: scored });
        }
        res.status(200).jsonp({ status: 200, matches: modData });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

toggleLive = async (req, res) => {
    try {
        let match = await matchModel.findOne({ _id: req.body.matchID });
        match.isLive = !match.isLive;
        await match.save()
        res.status(200).jsonp({ status: 200, message: "Updated Successfully" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

simulateMatch = async (req, res) => {
    try {
        let users = await userModel.find({ isAdmin: false });
        let matchId = req.body.matchId;
        if (users.length === 0) {
            res.status(200).jsonp({ status: 500, message: "No Users Available" });
        }
        var session = await userModel.startSession();
        await session.withTransaction(async () => {
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let userMatch = await userMatchModel.findOne({
                    userId: user._id,
                    matchId: matchId,
                });

                //if no team set for the match, skip the user
                if (!userMatch) {
                    continue;
                }

                let selectedPlayers = userMatch.squad;
                for (let j = 0; j < selectedPlayers.length; j++) {
                    let playerId = selectedPlayers[j];
                    let playerDataForMatch = await matchPointModel.findOne({
                        matchId: matchId,
                        playerId: playerId,
                    })
                    //If player not in match scorecard
                    if (!playerDataForMatch) {
                        continue; //Do nothing
                    } else {
                        let playerPtsForMatch = playerDataForMatch.points;
                        userMatch.pointsTaken += playerPtsForMatch;
                        user.points += playerPtsForMatch;
                        await userMatch.save();
                        await user.save();
                    }
                }
            }
            let match = await matchModel.findOne({ _id: matchId });
            match.isSimulated = true;
            await match.save();
        });
        session.endSession();
        res.status(200).jsonp({ status: 200, message: "Simulation Successfull" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}


undoSimulation = async (req, res) => {
    try {
        let users = await userModel.find({ isAdmin: false });
        let matchId = req.body.matchId;
        if (users.length === 0) {
            res.status(200).jsonp({ status: 500, message: "No Users Available" });
        }
        var session = await userModel.startSession();
        await session.withTransaction(async () => {
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let userMatch = await userMatchModel.findOne({
                    userId: user._id,
                    matchId: matchId,
                });

                //if no team set for the match, skip the user
                if (!userMatch) {
                    continue;
                }

                user.points -= userMatch.pointsTaken;
                await user.save();
                userMatch.pointsTaken = 0;
                await userMatch.save()
            }
            let match = await matchModel.findOne({ _id: matchId });
            match.isSimulated = false;
            await match.save();
        });
        session.endSession();
        res.status(200).jsonp({ status: 200, message: "Undo Simulation Successfull" });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}


getNotLiveMatches = async (req, res) => {
    try {
        let data = await matchModel.find({ isLive: false });
        res.status(200).jsonp({ status: 200, data: data });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}


getScoreCardForMatch = async (req, res) => {
    try {
        let matchId = req.body.matchId;
        let homeTeam = req.body.homeTeam;
        let awayTeam = req.body.awayTeam;
        
        let data = await matchPointModel.find({ matchId: matchId });
        if (data.length === 0) {
            return res.status(200).jsonp({ status: 500, message: "Match Has Not Been Scored Yet" });
        }

        let homePts = {}, awayPts = {};
        let homePlayers = await playerModel.distinct("_id", {teamName: homeTeam});
        let awayPlayers = await playerModel.distinct("_id", {teamName: awayTeam});

        homePlayers = homePlayers.map((id) => {
            return ""+id;
        });
        awayPlayers = awayPlayers.map((id) => {
            return ""+id;
        })

        for(let i=0;i<data.length;i++){
            let matchPoint = data[i];
            if(homePlayers.includes(""+matchPoint.playerId)){
                homePts[data[i].playerId] = data[i].points;
            } else if(awayPlayers.includes(""+matchPoint.playerId)){
                awayPts[data[i].playerId] = data[i].points;
            }
        }

        return res.status(200).jsonp({ status: 200, homePts: homePts, awayPts: awayPts });
    } catch (e) {
        console.log(e);
        return res.status(200).jsonp({ status: 500, message: "Server did not respond properly" });
    }
}

module.exports = {
    createMatch: createMatch,
    updatePlaying11: updatePlaying11,
    updatePtsForMatch: updatePtsForMatch,
    getAllMatches: getAllMatches,
    toggleLive: toggleLive,
    simulateMatch: simulateMatch,
    getNotLiveMatches: getNotLiveMatches,
    undoSimulation: undoSimulation,
    getScoreCardForMatch: getScoreCardForMatch
}