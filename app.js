require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const encrypt = require("mongoose-encryption")
const app = express()

mongoose.connect("mongodb://0.0.0.0:27017/userDB").then(() => {console.log("Connected to userDB")})

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

UserSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('User', UserSchema);

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res){
    res.render('home')
});

app.get('/login', function(req, res){
    res.render('login')
});

app.get('/register', function(req, res){
    res.render('register')
});

app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render('secrets')
        }
    });
})

app.post('/login', function(req, res){
    const username = req.body.username
    const password = req.body.password
    
    User.findOne({email: username}, function(err, userFound){
        if(userFound && userFound.password == password){
            res.render("secrets")
        }
        else if(err){
            console.log(err)
            res.send("<h1>Not found</h1>")
        }
    })
});





app.listen(3000, function(){
    console.log("Connected to port 3000")
})
