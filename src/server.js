/*
* mini-redis - an implementation of a Redis-based datastore in node.js
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/

const express = require('express'); //Import Express
const routes = require('./routes'); //Import Routes
const bodyParser = require('body-parser'); //Import body parser

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));//setting urlencoded
app.use(routes); //Setting routes

app.listen(port, function(){ console.log(`Mini-redis server running on port ${port}`); });//listen