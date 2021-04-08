const database = require('../utils/database');
const mongoose = require('mongoose');

let playerSchema = new mongoose.Schema(
    {
        name : {
            type: String, 
            default: "Sosa",
            required: true,
        },
        teamName : {
            type: String, 
            enum: ["CSK", "MI", "RCB", "PBKS", "KKR", "DC", "SRH", "RR"],
            default: "CSK"
        },
        totalPoints :{
            type : Number
        }
    }
)
module.exports = mongoose.model('Player', playerSchema);