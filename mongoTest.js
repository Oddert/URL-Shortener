var mongo = require('mongodb').MongoClient;

var url = "mongodb://Oddert:Bugatt1rulesoK@ds259499.mlab.com:59499/freecodecamp-playground";

mongo.connect(url ,function (err, db) {
    if (err) throw err;
    
    db.collection('urls').insertOne(
    {
      original_url: 'https://oddert.github.io/',
      short_url: '528491'
    },
    function (err, res) {
      if (err) {
        db.close();
        return console.log(err);
      }
      console.log("(18) success!");
      db.close();
    }
  )
  
  
})