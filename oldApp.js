var express = require('express'),
    app     = express(),
    bodyParser  = require('body-parser'),
    mongo       = require('mongodb').MongoClient;
    
var url = "mongodb://Oddert:Bugatt1rulesoK@ds259499.mlab.com:59499/freecodecamp-playground";
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
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
        mongo.connect(url, function (err, db) {
            if (err) throw err;
           var collection = db.collection('urls');
           collection.find({
              short_url: input.toString()
           }).toArray(function (err, docs) {
               if (err) throw err;
               console.log("Found items!", docs);
               if (docs.length === 0) {
                   console.log("No valid items found. Producing error...");
                   res.setHeader('Content-Type', 'application/json');
                   res.send(JSON.stringify({
                       error: "That URL is not registered. Try adding it!"
                   }))
               } else {
                   console.log("Valid item found, redirecting to url: ", docs[0].original_url);
                   res.redirect(docs[0].original_url);
               }
           });
        });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: "Something is very broken, line 51 :("
        }));
    }
    
    
});

app.get('/new/*', function (req, res) {
    var input = req.params[0];
    var inType = 'invalid';
    
    input = /\/$/.test(input) ? input : input + '/';
    
    console.log(input.toString());
    
    if (/(?=.*https|http)(?=.*\w(?=\.))/.test(input) === true) { inType = 'url' }
    
    if (inType == 'invalid') {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: "That address is not valid"
        }))
    } else if (inType == 'url') {
        
        mongo.connect(url, function (err, db) {
            if (err) throw err;
            var collection = db.collection('urls');
            collection.find({
                original_url: input.toString()
            }).toArray(function (err, docs) {
                if (err) throw err;
                console.log("Returned Documents! ", docs);
                if (docs.length === 0 ) {
                    console.log("...However, the entry is missing. Adding new instance...");
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
                    var newNum;
                    function assignNum(col) {
                        newNum = genNumber();
                        console.log("Randomly generated: ", newNum);
                        collection.find({
                            short_url: newNum
                        }).toArray(function (err, docs) {
                            if (err) throw err;
                            if (docs.length > 0) {
                                console.log("New Number found in db, trying again...");
                                assignNum();
                            } else {
                                console.log("New Number not found in db, proceding ok.");
                                var newEntry = {
                                    original_url: input,
                                    short_url: newNum
                                }
                                col.insertOne(newEntry, function (err, data) {
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
                    }
                    assignNum(collection);
                    
                } else {
                    console.log(", JSON'ing...");
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        original_url: docs[0].original_url,
                        short_url: docs[0].short_url
                    }));
                }
            })
        });
        
        
    } else {
        res.send('New Route! Your request: "' + input + '" is: ' + inType);
    }
    
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server initialised on port: " + process.env.PORT);
});