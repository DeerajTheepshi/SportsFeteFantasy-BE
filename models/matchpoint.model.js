const database = require('../utils/database');
const mongoose = require('mongoose');

let matchPointSchema = new mongoose.Schema(
    {
        matchId : {
            type:  mongoose.Types.ObjectId,
            required : true
        },
        playerId : {
            type:  mongoose.Types.ObjectId,
            required : true
        }, 
        points : {
            type: Number,
            required : true
        }
    }
)
module.exports = mongoose.model('MatchPoint', matchPointSchema);