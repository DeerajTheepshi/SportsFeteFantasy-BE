const express = require("express");
const rootRouter = require('./routes/root.routes');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 6000;
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

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
