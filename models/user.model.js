const database = require('../utils/database');
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema(
    {
        //AUTH DETAILS
        email: {
            type: String,
            lowercase: true,
            default: null,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            default: null,
            required: true
        },
        //PERSONAL DETAILS
        rollNo: String,
        name: { type: String, default: "" },
        contact: {type: String, default: ""},
        department: { type: String, default: "ICE" },
        //TEAM DETAILS
        squad : {
            type: [mongoose.Types.ObjectId]
        },
        //SELECTED PLAYERS RO BE CHOOSED BEFORE EVERY MATCH
        selectedPlayersForMatch : {
            type: [mongoose.Types.ObjectId]
        },
        //SESSION DETAILS
        session: {
            type: String,
            default: null,
        },
        isAdmin : {
            type : Boolean,
        }
    }
)
module.exports = mongoose.model('User', userSchema);