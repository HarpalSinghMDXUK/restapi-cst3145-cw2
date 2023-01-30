var express = require("express");
const cors = require("cors");
const morgan = require("morgan");
var path = require("path");

let propertiesReader = require("properties-reader");
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);
let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PWD
//for potential special characters
let dbUsername = properties.get("db.user");
let dbPwd = properties.get("db.pwd");
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;

const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);
// db.serverConfig.isConnected();

// console.log(db.serverConfig);


let app = express();
app.set('json spaces', 3);
app.use(cors());

app.use(morgan("short"));

app.use(express.json());

app.param('collectionName', function(req, res, next, collectionName){
    req.collection = db.collection(collectionName);
    return next();
});


app.use(function(req, res, next){
    console.log("Incoming request: " + req.url);
    next();
});

app.get("/", function(req, res){
    res.send("select a collection e.g., /collections/lessons");
});


// All Lessons
app.get("/collections/:collectionName", function(req, res, next){
    req.collection.find({}).toArray(function(err, results){
        if(err){
            return next(err);
        }
        res.send(results);
    });
});

// Limit to 2 - Price Desc
app.get("/collections/:collectionName/", function(req, res, next){
    req.collection.find({}, {limit: 2, sort: [["price", -1]]}).toArray(function(err, results){
        if(err){
            return next(err);
        }
        res.send(results);
    });
});


// Limit to 2 Price Asc
// app.get("/collections/:collectionName/", function(req, res, next){
//     req.collection.find({}, {limit: 2, sort: [["price", -1]]}).toArray(function(err, results){
//         if(err){
//             return next(err);
//         }
//         res.send(results);
//     });
// });


// Limit to /collections/lessons/1:limit/subjectName/desc
app.get("/collections/:collectionName/:max/:sortAspect/:sortAscDesc", function(req, res, next){
    
    var max = parseInt(req.params.max, 10);
    
    let sortDirection = 1;
    if (req.params.sortAscDesc === "desc"){
        sortDirection = -1;
    }

    req.collection.find({}, {limit: max, sort: [[req.params.sortAspect, sortDirection]]}).toArray(function(err, results){
        if(err){
            return next(err);
        }
        res.send(results);
    });

});

const ObjectId = require('mongodb').ObjectId;
app.get("/collections/:collectionName/:id", function(req, res, next){
    req.collection.findOne({ id: new ObjectId(req.params.id)}, function(err, results){
        if(err){
            return next(err);
        }
        res.send(results);
    });
});


app.post("/", function(req, res){
    res.send("a POST Request? Let's create an element");
});

app.put("/", function(req, res){
    res.send("Okay, let's update an element.");
});

app.delete("/", function(req, res){
    res.send("Are your sure? to delete an element.");
});

app.use(function(req, res){
    res.status(404).send("Resource not found!");
});

// http.createServer(app).listen(3000);
app.listen(3000, "0.0.0.0", function(){
    console.log("App is started on 3000")
});
