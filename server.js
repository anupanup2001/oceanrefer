// Mongo Db move it to diff file
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = process.env.MONGODB_URI;
// mongo db

const express = require('express');
var bodyParser = require('body-parser')
var GoogleAuth = require('google-auth-library');
const app = express();
app.use(express.static(__dirname + '/dist'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var router = express.Router();
app.use('/api', router);    //Use prefix /api for all rest calls
router.get('/', function(req, res) {
    res.json({message: 'Welcome to hello api'});
});

// Mongo db code move to separate file
var insertDocument = function(db, data, callback) {
  db.collection('referrals').insertOne( data, function(err, result) {
   assert.equal(err, null);
   console.log("Inserted referral into the referrals collection.");
   callback();
 });
};
// Mongodo code

router.post('/post_refer', (req, res) => {
  console.log('Got referral!!')
  console.log(req.body);
  console.log('Connecting to ' + url);
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, req.body, function() {
        db.close();
        res.json({message: 'success'})
    });
  });

});

router.post('/get_my_referrals', (req, res) => {
  console.log(req.body);
  console.log('Connecting to ' + url);
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('referrals').find({referer: req.body.referer_name}).toArray((err, docs) => {
      res.json(docs);
    });
  });
});

router.post('/validate_user', function(req, res) {
    console.log('validating user');
    console.log(req.body);
    res.json({message: 'Welcome to hello api'});
    
    var auth = new GoogleAuth;
    var client = new auth.OAuth2('722938357421-ngsr3ed10gndh4126ahao82vc7li9c1s.apps.googleusercontent.com', '', '');
    client.verifyIdToken(
        req.body.id_token,
        '722938357421-ngsr3ed10gndh4126ahao82vc7li9c1s.apps.googleusercontent.com',
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {
          var payload = login.getPayload();
          var userid = payload['sub'];
          console.log(payload);
          console.log(userid);
          // If request specified a G Suite domain:
          //var domain = payload['hd'];
        });
});

app.listen(process.env.PORT || 8080);
console.log(`Listening on port ${process.env.PORT || 8080}` );
