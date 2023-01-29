const { application } = require("express");
var express = require("express");

var ALLOWED_IPS = ["127.0.0.1", "123.456.7.89"];

var api = express.Router();

api.use(function(req, res, next){
    var msg = "Ip: " + req.ip;
    console.log(msg);
    next();
});

api.use(function(req, res, next){
    var userIsAllowed = ALLOWED_IPS.indexOf(req.ip) !== -1;
    if (!userIsAllowed) {
        res.status(401).send("Not authorized!");
    } else {
        next();
    }
});

api.get("/books", function(req, res) { 
    /* ... */ 
    res.send("Url requested: " + req.url);
});

api.post("/book", function(req, res) { 
    /* ... */ 
});

api.get("/messages", function(req, res) { 
    /* ... */ 
    res.send("Url requested: " + req.url);
});

api.post("/message", function(req, res) { 
    /* ... */ 
});

module.exports = api;