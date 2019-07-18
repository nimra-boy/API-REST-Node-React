const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require("mongoose");
const axios = require('axios');
const bodyParser = require('body-parser');

// JSON Data
var fs = require('fs');
var donnees = fs.readFileSync('Products.json');
var monJson = JSON.parse(donnees);


// Mongo connection
mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true }).then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

// Body Parser
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

// Cors
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Sockets
io.on("connection", socket => {
        socket.emit('all', monJson);
        socket.on('delete', (data) => {
            for( var i = 0; i < monJson.length; i++){ 
                if ( monJson[i]._id == data) {
                monJson.splice(i, 1);
                }
            };
            // Pour modifier directement le fichier 
            //  let datab = JSON.stringify(monJson, null, 2);
            //  fs.writeFile('Products.json', datab, (err) => {  
            //     if (err) throw err;
            // });
            socket.emit('all', monJson);
        });
        socket.on('edit', (editdata, id) => {
            for( var i = 0; i < monJson.length; i++){ 
                if ( monJson[i]._id == id) {
                  monJson[i] = editdata;
                }
            }
            socket.emit('all', monJson);
        });
        socket.on('new', (newdata) => {
            monJson.push(newdata);
            socket.emit('all', monJson);
            console.log(monJson);
        })
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
});

// Router
var router = express.Router();
app.use('/user', router);
require(__dirname + '/controllers/userController')(router);

// Port
var port = 8000;
server.listen(port, () => console.log(`Listening on port ${port}`));