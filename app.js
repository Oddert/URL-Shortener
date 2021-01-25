require('dotenv').config();
var express = require('express'),
    app     = express(),
    bodyParser  = require('body-parser'),
    mongo       = require('mongodb').MongoClient;

var url = process.env.DATABASE;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


function genNumber() {
    var out = '';
    function genOne() {
        return Math.floor(Math.random() * 10);
    }
    for (var i=0; i<4; i++) {
        out += genOne().toString();
    }
    return out;
}




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
           console.log("Tester returned OK, everything should be dandy, lad");
        //   console.log(each);
       });
       
    });
    //YAaaaaaaasssssss laaaaaad
    res.render("index");
});



app.get('/:number', function (req, res) {
   var inType = 'invalid';
   var input = req.params.number;
   
   if (/^[0-9]*$/.test(input) === true) { inType = 'num' }
   
   if (inType == 'invalid') {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: "This url number is invalid"
        }));
    } else if (inType == 'num') {
        mongo.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('freecodecamp-playground');
            var collection = db.collection('urls')
            
            collection.find({
                short_url: input.toString()
            }).toArray(function (err, docs) {
                if (err) throw err;
                console.log("Found Items!");
                if (docs.length === 0) {
                    console.log("No valid items found in search, producing error...");
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stiringify({
                        error: "That URL is not registered. Try Adding it!"
                    }))
                } else {
                    console.log("Valid item found, redirecting to url: ", docs[0].original_url);
                    res.redirect(docs[0].original_url);
                }
            }); //collection find > toArray
        }); // mongo connect
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: "Something is very broken, line 73 :("
        }))
    }
    
});



app.get('/new/*', function (req, res) {
    var input = req.params[0];
    var inType = 'invalid';

    input = /\/$/.test(input) ? input : input + '/';
    
    if (/(?=.*https|http)(?=.*\w(?=\.))/.test(input) === true) { inType = 'url' }

    if (inType == 'invalid') {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: "That address is not valid"
        }))
    } else if (inType == 'url') {
        
        mongo.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('freecodecamp-playground');
            var collection = db.collection('urls');
            
            collection.find({
                original_url: input.toString()
            }).toArray(function (err, docs) {
                if (err) throw err;
                console.log("Returned Documents!");
                if (docs.length === 0) {
                    console.log("...however the entry is missing. Adding new instance...");
                    //genNumber decliration moved;
                    var newNum;
                    function assignNum(col) {
                        newNum = genNumber();
                        console.log("randomly generated: ", newNum);
                        collection.find({
                            short_url: newNum
                        }).toArray(function (err, docs) {
                            if (err) throw err;
                            if (docs.length > 0) {
                                console.log("Newly generated number is already used in db, trying again...");
                                assignNum();
                            } else {
                                console.log("New number is not in db, proceding to add...");
                                var newEntry = {
                                    original_url: input,
                                    short_url: newNum
                                };
                                collection.insertOne(newEntry, function (err, data) {
                                    if (err) throw err;
                                    console.log("(144) Added new items successfully!");
                                });
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify({
                                    original_url: input,
                                    short_url: newNum
                                }));
                            }
                        })
                    } // assignNum()
                    assignNum(collection);
                } else { // docs.length =< 0
                    console.log(", JSON'ing...");
                    res.setHeader('Content-Tupe', 'application/json');
                    res.send(JSON.stringify({
                        original_url: docs[0].original_url,
                        short_url: docs[0].short_url
                    }));
                }
            }); // collection find => toArray
        })
    }

});


const PORT = process.env.PORT || 8080

app.listen(PORT, process.env.IP, function () {
    console.log("Server initialised on port: " + PORT);
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
