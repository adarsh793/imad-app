var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool= require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    user:'adarsh793',
    database:'adarsh793',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt){
    //how do we create a hash?
    var hashed = crypto.pbkdf2sync(input,salt,10000,512,'sha512');
    return hashed.toString('hex');
    
}


app.get('/hash/:input', function(req, res){
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
    
});

app.post('/create-user', function(req, res){
   //username, password
   var username= req.body.username;
   var password= req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString= hash(password, salt);
   pool.query('INSERT INTO "user"(username, password) VALUES ($1, $2)', [username, dbString], function(err, result){
      if(err){
          res.status(500).send(err.toString());
      }else {
          res.send("user successfully created" + username);
      }
      
       
   });
   
    
});

var pool= new Pool(config);
app.get('/test-db', function(req, res){
    //make a select request
    //return a response wid results.
    pool.query('SELECT * FROM test', function(err,result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result));
        }
        
    });
});

var counter=0;
app.get('/counter', function(req,res) {
   counter= counter +1;
   res.send(counter.toString());
});

app.get('/article-one', function(req, res){
  res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});

app.get('/article-two', function(req, res){
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));  
});
app.get('/article-three', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function(req, res){
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));  
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var names =[];
app.get('/submit-name/:name', function(req,res){ //URL:/submit-name?name=xxxxx
    //get the name from the request.
    var name = req.query.name;
    
    names.push(name);
    //JSON:Javascript Object Notation
    res.send(JSON.stringify(names));
    
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
