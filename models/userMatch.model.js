const database = require('../utils/database');
const mongoose = require('mongoose');

let userMatchSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
        }, 
        matchId: {
            type: mongoose.Types.ObjectId,
        },
        squad: {
            type: [mongoose.Types.ObjectId],
        },
        pointsTaken: {
            type: Number
        }
    }
)
module.exports = mongoose.model('UserMatch', userMatchSchema);