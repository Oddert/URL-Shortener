var express = require('express'),
    app     = express(),
    bodyParser  = require('body-parser'),
    mongo       = require('mongodb').MongoClient;
    
var url = "mongodb://Oddert:Bugatt1rulesoK@ds259499.mlab.com:59499/freecodecamp-playground";
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    mongo.connect(url, function(err, client) {
       if (err) throw err;
       
       var db = client.db('freecodecamp-playground');
       
       var collection = db.collection('urls');
       
       var parsed = collection.find({
           short_url: "1482"
        });
        
       parsed.toArray(function (err, each) {
           if (err) throw err;
           console.log(each);
       });
       
    });
    //YAaaaaaaasssssss laaaaaad
    res.send("Hello from the seperate file");
});

app.listen(process.env.PORT | 8080, process.env.IP, function () {
    console.log("Server initialised on port: " + process.env.PORT);
});



/*
Replace:

mongo.connect(url, function (err, db) {
   if (err) throw err;
    var collection = db.collection('urls');
    
    collection.find({
        original_url: input.toString()
    }).toArr// ..... yada yada
});

-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

With:

mongo.connect(url, function (err, client) {
   if (err) throw err;
   
   var db = client.db('freecodecamp-playground');
   
   var collection = db.collection('urls');
   
   var urls = collection.find();
   
});

*/