const database = require('../utils/database');
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema(
    {
        //AUTH DETAILS
        email: {
            type: String,
            lowercase: true,
            default: null,
        },
        password: {
            type: String,
            default: "",
        },
        //PERSONAL DETAILS
        rollNo: String,
        name: { type: String, default: "" },
        contact: {type: String, default: ""},
        //TEAM DETAILS 
        teamName : {
            type : String,
        },
        //SQUAD DETAILS
        squad : {
            type: [mongoose.Types.ObjectId]
        },        
        //SCORE
        points : {
            type: Number,
            default: 0,
        },
        //SESSION DETAILS
        session: {
            type: String,
            default: null,
        },
        isAdmin : {
            type : Boolean,
            defaut: false,
        }
    }
)
module.exports = mongoose.model('User', userSchema);