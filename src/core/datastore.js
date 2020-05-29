/*
* datastore.js - responsible for handling data in the datastore
*
* @author Marc Reinan Gomes Dantas do Nascimento 
*/

var memory = []; //DS | memory abstraction

function count() { return memory.length; } //return the length of datastore

//search a pair [key:value] by key
function findByKey(k) {
  for (var index in memory) {
    var obj = memory[index];
    if (k === obj.key) {
      return memory[index];
    }
  }
  return null;
}

//delete a pair [key,value] by key
function deleteByKey(k) {
  for (var index in memory) {
    var obj = memory[index];
    if (k === obj.key) {
      memory.splice(index, 1);
      return true;
    }
  }
  return false;
}
//order a array[key,value] by key
function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return 0;
  } else {
    return (a[0] < b[0]) ? -1 : 1;
  }
}

module.exports = {
  /* SET key value [EX] - Set key to hold the string value. If key already holds a value, 
  * it is overwritten, regardless of its type. Any previous time to live associated with the key 
  * is discarded on successful SET operation.
  * EX seconds -- Set the specified expire time, in seconds.
  */
  set(key, value, ex) {
    var line = findByKey(key);//search by key
    if (line === null) {
      memory.push({
        key: key,
        value: value,
        ex: ex
      });//insert new pair[key,value]
      line = findByKey(key);//search by key and update var
    //updates existing
    } else {
      line.value = value;
      line.ex = ex;
    }
    
    ex = parseInt(ex);//convert ex in a number
    if (typeof (ex) === 'number') {//check
      if (ex > -1) {//check for time valid
        var timer = setInterval(function () {//setting function to decrease the ex
          if (line.ex > 0) {
            line.ex--;// -1 per second
          } else {
            deleteByKey(key);// delete by key in the end of time
            clearInterval(timer); //delete the task
          }
        }, 1000);//seconds to interval
      }
    }
    return 'OK';
  },

  /* GET key - Get the value of key. 
  * If the key does not exist the special value nil is returned. 
  */
  get(key) {
    var line = findByKey(key);//search by key
    if (line !== null) {
      return `"${line.value}"`;
    } else {
      return '(nil)';
    }
  },
  /* DEL key [key ...]
  * Removes the specified keys. A key is ignored if it does not exist.
  */
  del(params) {
    var count = 0;
    for (var i = 0; i < params.length; i++) {
      if (deleteByKey(params[i]) == true) {
        count++;
      }
    }
    return '(integer) ' + count;

  },
  /* DBSIZE
  * Return the number of keys in the currently-selected database.
  */
  dbsize() {
    return count();
  },
  /* INCR key - Increments the number stored at key by one. If the key does not exist,
  * it is set to 0 before performing the operation. An error is returned if the key contains 
  * a value of the wrong type or contains a string that can not be represented as integer. 
  */
  incr(key, value) {
    var line = findByKey(key);//search by key
    value = parseInt(value);//format the value

    if (line === null) {//if a pair not found
      this.set(key, "0", -1);//insert new pair [key,0]
      line = findByKey(key);//search by key and update var
    }

    var number = parseInt(line.value);//format the value

    if (typeof (number) === 'number') {//check format
      line.value = number + value;//add values and update pair
      return "(integer) " + line.value;
    }
  },
  /* ZADD key [score, members]
  * Adds all the specified members with the specified scores to the sorted set stored at key. 
  * It is possible to specify multiple score / member pairs. If a specified member is already 
  * a member of the sorted set, the score is updated and the element reinserted at the right position 
  * to ensure the correct ordering.
  * If key does not exist, a new sorted set with the specified members as sole members is created, 
  * like if the sorted set was empty. If the key exists but does not hold a sorted set, an error 
  * is returned.
  *
  */
  zadd(k, elements) {
    var line = findByKey(k);//search by key
    let flag = true;

    if (line !== null) {//if a pair found
      if (Array.isArray(line.value)) {//check the format of the value
        //check if is a new element or update existing
        line.value.findIndex(f => f[1] === elements[0][1]) != -1 ? flag = false : flag = true;
        elements = elements.concat(line.value); //group element with existing
      } else {
        return `This key is not a Sorted set`;
      }
    }
    //filter the elements removing duplicates
    elements = elements.filter((item, pos, array) => {
      return array.map(x => x[1]).indexOf(item[1]) === pos;
    }).sort(sortFunction);//order members by score

    this.set(k, elements, -1);//insert the elements

    return flag;
  },
  /* ZCARD key
  * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
  */
  zcard(k) {
    var setArr = findByKey(k);//search by key
    if (setArr !== null) {//check if exists
      if (Array.isArray(setArr.value)) {//check if is a array
        return `(integer) ${setArr.value.length}`;//return the length
      } else {
        return `This key is not a Sorted set`;//error msg
      }
    } else {
      return `This key is not found`;//error msg

    }
  },
  
  /*
  * ZRANK key member 
  * Returns the rank of member in the sorted set stored at key, with the scores ordered
  * from low to high. The rank (or index) is 0-based, which means that the member with the
  * lowest score has rank 0
  */
  zrank(k, member) {
    var line = findByKey(k);//search by key
    if (line !== null) {//check if exists
      if (Array.isArray(line.value)) {//check if is a array
        const result = line.value.findIndex(f => f[1] === member);//get a position
        if(result !== -1){
          return `(integer) ${result}`;
       }else{
         return '(nil)';
       }
      } else {
        return `This key is not a Sorted set`;
      }
    } else {
      return `This key not found`;

    }
  },
  /*
  * ZRANGE key start stop [WITHSCORES] 
  * Returns the specified range of elements in the sorted set stored at key. The elements 
  * are considered to be ordered from the lowest to the highest score. Lexicographical order
  * is used for elements with equal score.
  */
  zrange(k, start, stop, score) {
    var line = findByKey(k);//seacrh by key
    if (line !== null) {//check if exists
      if (Array.isArray(line.value)) {//check if is a array
        const result = line.value.slice(start, stop);//slice the elements
        var stringReturn = " ";
        if (score === true) {
          for (k in result) {
            //print with score
            stringReturn += `${k}) "${result[k][1]}" "${result[k][0]}"<br>`;
          }
        } else {
          for (k in result) {
            //print without score
            stringReturn += `${k}) "${result[k][1]}"<br>`;
          }
        }
        return stringReturn;
      } else {
        return `This key is not a Sorted set`;
      }
    } else {
      return `This key is not found`;

    }
  },
  //debug function
  listMemory() {
    for (var i in memory) {
      var line = memory[i];
      console.log(`${i}) ${line.key}:${line.value} -${line.ex!=-1?line.ex:''}`);
    }
  }
}