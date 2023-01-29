var express = require("express");
var path = require("path");
// require your router

var apiRouter = require("./routes/api_router");

var app = express();

// var publicPath = path.resolve(__dirname, "public");
var staticPath = path.resolve(__dirname, "static");
// var imagesPath = path.resolve(__dirname, "images");
app.use(express.static(staticPath));
app.use("/static", express.static(staticPath));
// use your router
// any URL that starts with '/api' will be
// sent to 'apiRouter',
// such as '/api/books' and '/api/message'
app.use("/api", apiRouter);

app.use(function(req, res){
    res.status(404).send("File or Page not found")
});

// http.createServer(app).listen(3000);
app.listen(3000, "0.0.0.0", function(){
    console.log("App is started on 3000")
});
