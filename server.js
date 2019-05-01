//#region Requirements
const config = require('./config');
const express = require('express');
const app = express();
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const dburl = `mongodb://${config.dbserver.userName}:${config.dbserver.password}@${config.dbserver.ip}/${config.dbserver.dbName}`;
let db;
//#endregion

//#region Main Code

app.post('/additem', function (req, res) {
    let newItem = {};

    newItem.name = req.body.name;
    newItem.checked = req.body.checked;
    newItem.hidden = req.body.hidden;
    newItem.date = req.body.date;

    db.collection("Items").insertOne(newItem)
        .then(() => {
            res.send(true);
        })
        .catch(e => {
            res.send(e);
        })
});

app.post("/loaditem", function (req, res) {
    db.collection("Items").find().toArray(function (err, arrayItems) {
        if (err) {
            console.log(err);
            res.send(false);
        } else {
            res.send(arrayItems);
        }
    });
});

app.post("/hideitem", function (req, res) {
    db.collection("Items").updateOne({'_id': ObjectId(req.body._id)}, {$set: {hidden: true}})
        .then(() => {
            res.send(true)
        })
        .catch(e => {
            res.send(e)
        });
});

app.post("/checkitem", function (req, res) {
    db.collection("Items").updateOne({'_id': ObjectId(req.body._id)}, {$set: {checked: true}})
        .then(() => {
            res.send(true)
        })
        .catch(e => {
            res.send(e)
        });
});



//#endregion

//#region Starting server
MongoClient.connect(dburl, {useNewUrlParser: true}, (err, client) => {
    console.log("Connected successfully to db");

    db = client.db(config.dbserver.dbName);

    app.listen(config.app.port, () => {
        console.log(`Listening ${config.app.host}:${config.app.port}`);
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
//#endregion>