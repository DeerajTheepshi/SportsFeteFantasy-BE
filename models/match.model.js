const database = require('../utils/database');
const mongoose = require('mongoose');

let matchSchema = new mongoose.Schema(
    {
        matchNo : {
            type: int, 
            default: 1,
            required: true,
        },
        homeTeam : {
            type: String, 
            enum: ["CSK", "MI", "RCB", "KXIP", "KKR", "DC", "SRH", "RR"],
            default: "CSK",
            required: true
        }, 
        awayTeam : {
            type: String, 
            enum: ["CSK", "MI", "RCB", "KXIP", "KKR", "DC", "SRH", "RR"],
            default: "CSK",
            required: true
        },
        homeEleven : {
            type: [mongoose.Types.ObjectId]
        },
        awayEleven : {
            type: [mongoose.Types.ObjectId]
        }
    }
)
module.exports = mongoose.model('Match', matchSchema);