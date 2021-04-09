const express = require("express");
const rootRouter = require('./routes/root.routes');
const userRouter = require('./routes/user.routes');
const playerRouter = require('./routes/player.routes');
const matchRouter = require('./routes/match.routes');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');


const app = express();
const port = 7027;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/assets/', (req,res, next) => { 
    try{
        if(fs.existsSync("./public"+req.path)){
            next();
        } else {
            req.url = "/images/profiles/profilepic_temp.jpg";
            next();
        }
    } catch (e){
        console.log(e);
        return;
    }
},express.static("public",{
    etag: true,
    maxAge: '365d',
}));

app.use('/', rootRouter);
app.use('/user/',userRouter);
app.use('/match/', matchRouter);
app.use('/player/', playerRouter);

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
