const userModel = require('../models/user.model');
const utils = require('../utils/utils');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;

checkSession = async (req, res, next) => {
    if(!req.body.session)
        return res.status(200).jsonp({message:"User not Logged In"});
    let user = await userModel.findOne({session:session});
    if(!user){
        return res.status(200).jsonp({message:"Invalid Session"});
    }
    req.locals.user = user;
    return next();
}

checkAdmin = async(req, res, next) => {
    let user = req.locals.user;
    if(!user.isAdmin){
        return res.status(200).jsonp({message:"You are Not Authorized"});
    }
    return next();
}

register = async (req, res) => {
    let hashedPass = await bcrypt.hash(req.body.pass, saltRounds);
    let user = new userModel({
        email: req.body.email,
        password: hashedPass,
        rollNo: req.body.rollNo,
        name: req.body.name,
        contact: req.body.contact,
        department: req.body.department,
        isAdmin: false,
    });
    user.save();
    res.status(200).jsonp({message:"Registration Successfull"});
}

login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user = await userModel.find({email: email});
    if(!user) {
        res.status(200).jsonp({message:"User Not Found"});
    }
    let matches = await bcrypt.compare(password, user.password);
    if (matches) {
        let session = await utils.generateRandomString(16);
        user.session = session;
        await user.save();
        return res.status(200).jsonp({message:"Login Successfully", user: user});
    } else {
        res.status(200).jsonp({message:"Password Incorrect"});
    }
}

setTeam = async (req, res) => {
    let user = req.locals.user;
    let selectedPlayers = req.selectedPlayers;
    user.selectedPlayersForMatch = selectedPlayers;
    await user.save();
    return res.status(200).jsonp({message:"Team Has been Successfully Set"});
}

setSquad = async (req, res) => {
    let user = req.locals.user;
    let squad = req.squad;
    user.squad = squad;
    await user.save();
    return res.status(200).jsonp({message:"Squad Has been Successfully Set"});
}

module.exports = {
    register: register, 
    login: login, 
    checkSession: checkSession, 
    checkAdmin: checkAdmin,
    setTeam : setTeam,
    setSquad : setSquad,
}