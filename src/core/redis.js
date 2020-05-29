/*
 * Redis - Responsible for db requests, checking and handling parameters
 * @author Marc Reinan Gomes Dantas do Nascimento
 */

const datastore = require('./datastore.js'); // import datastore

function splitStr(str) {  return str.split(" ") } //function to split string

module.exports = {
  //processes the request and initiates the corresponding command
  cmd(req, res) { //call ?cmd=[command] [params]
    let { cmd } = req.query; //RAW query
    cmd = cmd.replace(/[^a-zA-Z0-9_\s]/gi,'_');//regex
    cmd = splitStr(cmd);//format query

    const command = cmd[0]; //cmd parameter
    var params = cmd.slice(1); //other parameters

    switch (command) {
      //SET - Add a item in a Datastore
      case 'SET': //call ?cmd=SET key value || ?cmd=SET key value EX seconds
        if (params.length < 2) {
          res.status(400).send(`Params is missing`);
        } else {
          const ttl = params[2] === "EX" ? params[3] : -1; //set a ttl if EX option 
          //function set(key, value, ttl) - add a item[key:value] in DS
          res.send(datastore.set(params[0], params[1], ttl)); //return 'OK' 
        }
        break;

      //GET - Get a item in a Datastore
      case 'GET': //call ?cmd=GET key
        if (params.length < 1) {
          res.status(400).send(`Params is missing`);
        } else {
          //function .get(key) - get a item from DS, if item with key exists
          res.send(datastore.get(params[0])); //return value of item or (nil) 
        }
        break;

        //DEL - Delete one or more itens in Datastore
      case 'DEL': //call ?cmd=DEL key
        if (params.length < 1) {
          res.status(400).send(`Params is missing`) //Error msg
        } else {
          //function .del(key1, key2,...,keyN)- delete one (or more) item from DS
          res.send(datastore.del(params)); //return number of itens deleted
        }
        break;

        //DBSIZE - Return the number of keys in the currently-selected database.
      case 'DBSIZE': //call ?cmd=DBSIZE
        //function .dbsize()
        res.send(`(integer) ${datastore.dbsize()}`); //return a number of itens in DS
        break;

        //INCR - Increments a value of item, if value não informado, adiciona 1 ao valor
      case 'INCR': //call ?cmd=INCR key value
        if (params.length < 1) {
          res.status(400).send(`Params is missing`)
        } else { //Error msg
          if (params.length == 1) {
            params.push(1)
          } //preenche o valor, caso n seja informado
          //function .incr(key,value)
          res.send(datastore.incr(params[0], params[1])); //return the new value
        }
        break;

        //ZADD - Adds all the specified members with the specified scores to the sorted set stored at key. 
        //It is possible to specify multiple score / member pairs. If a specified member is already 
        //a member of the sorted set, the score is updated and the element reinserted at the right position to ensure the correct ordering.
      case 'ZADD': //call ?cmd=ZADD key score member
        if (params.length < 3) {
          res.status(400).send(`Params is missing`)
        } else { //Error msg
          let count = 0; //counter of elements
          const paramsSet = params.slice(1); //get a set of members and scores
          let element = []; //stack to make the add
          for (var i = 0; i < paramsSet.length; i += 2) { //running the set
            element.push([paramsSet[i], paramsSet[i + 1]]); //add one element [score,member]
            datastore.zadd(params[0], element) == true ? count++ :'';//counter the number of new inserts
            element.pop(); //remove the element
          }
          res.send(`(integer) ${count}`); //return the number of new inserts
        }
        break;

        //ZCARD key - Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
      case 'ZCARD': //call ?cmd=ZCARD key
        if (params.length < 1) {
          res.status(400).send(`Params is missing`)
        } else { //Error msg
          res.send(datastore.zcard(params[0]));
        }
        break;

        //ZRANK key member - Returns the rank of member in the sorted set stored at key, with the scores ordered from low to high.
        //The rank (or index) is 0-based, which means that the member with the lowest score has rank 0.
      case 'ZRANK': //call ?cmd=ZRANK key member        
        if (params.length < 2) {
          res.status(400).send(`Params is missing`)
        } else { //Error msg
          res.send(datastore.zrank(params[0], params[1]));
        }
        break;
      //Returns the specified range of elements in the sorted set stored at key. The elements are considered to be ordered from 
      //the lowest to the highest score. Lexicographical order is used for elements with equal score.
      case 'ZRANGE'://call ?cmd=ZRANGE 
        if (params.length < 2) {
          res.status(400).send(`Params is missing`)//Error msg
        } else {
          let scores = (params[3] === 'WITHSCORES') ? true : false;
          res.send(datastore.zrange(params[0], params[1], params[2], scores));
        }
        break;

      default:
        res.status(404).send('Command not found');
    }
    console.log(`--REQUEST--`)
    console.log(`command: ${command}`);
    console.log(`key: ${params[0]}`);
    console.log(`value: ${params[1]}`);
    console.log(`params: ${params.slice(2)}`);
    console.log(`--DATASTORE--`)
    console.log(datastore.listMemory());
  }
}