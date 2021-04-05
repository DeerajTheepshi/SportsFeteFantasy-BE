const database = require('../utils/database');
const mongoose = require('mongoose');

let gameSchema = new mongoose.Schema(
    {
        isLive: {
            type: Boolean,
            default: false,
        }
    }
)
module.exports = mongoose.model('Game', gameSchema);