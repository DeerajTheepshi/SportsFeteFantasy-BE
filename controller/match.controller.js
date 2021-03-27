const matchController = require('../controller/match.controller');
const matchModel = require('../models/match.model');
const matchPointModel = require('../models/matchpoint.model');
const playerModel = require('../models/player.model');

createMatch = async (req, res) => {
    let match = new matchModel({
        matchNo: req.body.matchNo,
        homeTeam: req.body.homeTeam,
        awayTeam: req.body.awayTeam,
        homeEleven: [],
        awayEleven: [],
    })
    await match.save()
};

updatePlaying11 = async (req,res) => {
    let home11Ids = req.body.homeTeam;
    let awa11Ids = req.body.awayTeam;
    let match = matchModel.findOne({matchNo: req.body.matchNo});

    for(let id in home11Ids){
        match.homeEleven.push(id);
    }

    for(let id in away11Ids){
        match.awayEleven.push(id);
    }

    await match.save()
}

updatePtsForMatch = async (req, res) => {
    let ptsDetails = req.body.ptsDetails;
    let matchId = req.body.matchId;
    const session = await matchPointModel.startSession();
    await session.withTransaction(async () => {
        for(let ptsDetail in ptsDetails) {
            let playerId = ptsDetail.playerId;
            let playerPts = ptsDetail.playerPts;
            let matchPoint = new matchPointModel({
                matchId: matchId,
                playerId: playerId,
                points: playerPts
            });
            await matchPointModel.save();
        }
    })
    session.endSession();
    session = await playerModel.startSession();
    await session.withTransaction(async () => {
        for(let ptsDetail in ptsDetails) {
            let player = playerModel.findOne({id:ptsDetail.playerId});
            let playerPts = ptsDetail.playerPts;
            player.totalPoints += playerPts;
            await player.save();
        }
    })
    session.endSession();
    res.status(200).jsonp({message: "Points Updated Successfully"});    
}

module.exports = {
    createMatch: createMatch,
    updatePlaying11: updatePlaying11,
    updatePtsForMatch: updatePtsForMatch
}