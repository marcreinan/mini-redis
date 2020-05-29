/*
* Routes - API Routes: Directs the request to the redis middleware
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/

const express = require('express'); // Import Express.js
const redis = require('./core/redis'); //Import redis
const routes = express.Router(); // Import default Express router
//Main route - /?cmd=
routes.get('/', (req, res) => redis.cmd(req, res));//main route for request
  
module.exports = routes;