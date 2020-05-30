# Mini-ReDis

A Mini Redis implementation in node.js that supports a subset of the Redis command set
Version 1.0.0

Link to app online: https://mini-redis-node.herokuapp.com/


## Getting Started

Clone the project and run the command npm run start in the root folder

### Prerequisites

You must have node.js installed

### Commands and endpoints
 All commands are done through the CMD parameter in the GET request. ex: https://mini-redis-node.herokuapp.com/?cmd=DBSIZE
 The params are separate with blankspaces or %20 write in request, the command definitions are all available at http://redis.io/commands​. 
 
 1. SET​ key value - /?cmd=SET key value
  Set key to hold the string value. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful SET operation.

 2. SET​ key value EX seconds - /?cmd=SET key value EX seconds
  EX seconds -- Set the specified expire time, in seconds.

 3. GET​ key - /?cmd=GET key
  Get the value of key. If the key does not exist the special value nil is returned. 

 4. DEL​ key - /?cmd=DEL key [key...]
  Removes the specified keys. A key is ignored if it does not exist.

 5. DBSIZE - /?cmd=DBSIZE 
  Return the number of keys in the currently-selected database.

 6. INCR​ key value - /?cmd=INCR key value
  Increments the number stored at key by one. If the key does not exist,
  it is set to 0 before performing the operation. An error is returned if the key contains 
  a value of the wrong type or contains a string that can not be represented as integer. 

 7. ZADD​ key score member - /?cmd=ZADD key score member [score member]
  Adds all the specified members with the specified scores to the sorted set stored at key. 
  It is possible to specify multiple score / member pairs. If a specified member is already 
  a member of the sorted set, the score is updated and the element reinserted at the right position 
  to ensure the correct ordering.
  If key does not exist, a new sorted set with the specified members as sole members is created, 
  like if the sorted set was empty. If the key exists but does not hold a sorted set, an error 
  is returned.

 8. ZCARD​ key - /?cmd=ZCARD key
  Returns the sorted set cardinality (number of elements) of the sorted set stored at key.

 9. ZRANK​ key member - /?cmd=ZRANK key member
  Returns the rank of member in the sorted set stored at key, with the scores ordered
  from low to high. The rank (or index) is 0-based, which means that the member with the
  lowest score has rank 0

 10. ZRANGE​ key start stop [WITHSCORES]- /?cmd=ZRANGE key start stop [WITHSCORES]
  Returns the specified range of elements in the sorted set stored at key. The elements 
  are considered to be ordered from the lowest to the highest score. Lexicographical order
  is used for elements with equal score.
  
## Future features
1. Calls in the REST standard
2. Unit tests for all commands
3. Webview for datastore
4. Webview for terminal redis
 
## Author

* **Marc Reinan Gomes** - [marcreinan](https://github.com/marcreinan)
