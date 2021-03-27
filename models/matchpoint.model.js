const database = require('../utils/database');
const mongoose = require('mongoose');

let matchPointSchema = new mongoose.Schema(
    {
        mathchId : {
            type:  mongoose.Types.ObjectId,
            required : true
        },
        playerId : {
            type:  mongoose.Types.ObjectId,
            required : true
        }, 
        points : {
            type: int,
            required : true
        }
    }
)
module.exports = mongoose.model('MatchPoint', playerSchema);