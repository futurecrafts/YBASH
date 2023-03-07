const express = require('express');
const app = express();
const cors = require('cors')
const auth = require("./src/TokenChecker");
const DB_SOURCE = "./db/users.sqlite";
const port = 7777;

require("dotenv").config();
var sqlite3 = require('sqlite3').verbose();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

let userdb = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message) // in case of cannot open database
      throw err
    } 
    else {     
        console.log('Successfully connected to DB!')   
        var salt = bcrypt.genSaltSync(20);
        
        userdb.run(`CREATE TABLE Users (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Username text, 
            Email text, 
            Password text,             
            Salt text,    
            Token text,
            DateLoggedIn DATE,
            DateCreated DATE
            )`,
        (err) => {
            if (err) {
                // Table already created and exist
            } else{
                // We need to create a table with adding some records
                var insert = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
                userdb.run(insert, ["user1", "user1@test.com", bcrypt.hashSync("user1", salt), salt, Date('now')])
                userdb.run(insert, ["user2", "user2@test.com", bcrypt.hashSync("user2", salt), salt, Date('now')])
                userdb.run(insert, ["user3", "user3@test.com", bcrypt.hashSync("user3", salt), salt, Date('now')])
                userdb.run(insert, ["user4", "user4@test.com", bcrypt.hashSync("user4", salt), salt, Date('now')])
            }
        });  
    }
});

module.exports = userdb

app.use(
    express.urlencoded({ extended: true }),
    cors({
        origin: 'http://localhost:3000'
    })
);

app.get('/', (req, res) => res.send('API Root'));

// REGISTER
app.post("/api/register", async (req, res) => {
    var errors=[]
    try {
        const { Username, Email, Password } = req.body;

        if (!Username){
            errors.push("Username is missing");
        }
        if (!Email){
            errors.push("Email is missing");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        let userExists = false;
        
        
        var sql = "SELECT * FROM Users WHERE Email = ?"        
        await userdb.all(sql, Email, (err, result) => {
            if (err) {
                res.status(402).json({"error":err.message});
                return;
            }
            
            if(result.length === 0) {                
                
                var salt = bcrypt.genSaltSync(10);

                var data = {
                    Username: Username,
                    Email: Email,
                    Password: bcrypt.hashSync(Password, salt),
                    Salt: salt,
                    DateCreated: Date('now')
                }
        
                var sql ='INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
                var params =[data.Username, data.Email, data.Password, data.Salt, Date('now')]
                var user = userdb.run(sql, params, function (err, innerResult) {
                    if (err){
                        res.status(400).json({"error": err.message})
                        return;
                    }
                  
                });           
            }            
            else {
                userExists = true;
                // res.status(404).send("User Already Exist. Please Login");  
            }
        });
  
        setTimeout(() => {
            if(!userExists) {
                res.status(200).json("Success");    
            } else {
                res.status(201).json("Record already exists. Please login");    
            }            
        }, 500);


    } catch (err) {
      console.log(err);
    }
})

// LOGIN
app.post("/api/login", async (req, res) => {
    try {      
      const { Email, Password } = req.body;
          // Make sure there is an Email and Password in the request
          if (!(Email && Password)) {
              res.status(400).send("All input is required");
              return;
          }
              
          let user = [];
          
          var sql = "SELECT * FROM Users WHERE Email = ?";
          userdb.all(sql, Email, function(err, rows) {
              if (err){
                  res.status(400).json({"error": err.message})
                  return;
              }

              if (rows.length > 0) {
                rows.forEach(function (row) {
                    user.push(row);                
                }) 
              } else {
                return res.status(400).send("No Match"); 
              }
              
              var PHash = bcrypt.hashSync(Password, user[0].Salt);
         
              if(PHash === user[0].Password) {
                  // * CREATE JWT TOKEN
                  const token = jwt.sign(
                      { user_id: user[0].Id, username: user[0].Username, Email },
                        process.env.TOKEN_KEY,
                      {
                        expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                      }  
                  );
  
                  user[0].Token = token;
  
              } else {
                  return res.status(400).send("No Match");          
              }
  
             return res.status(200).send(user);                
          });	
      
      } catch (err) {
        console.log(err);
    }    
});

// ALL
app.get("/api/users", (req, res, next) => {
    var sql = "SELECT * FROM Users"
    var params = []
    userdb.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// SINGLE USER
app.get("/api/user/:id", (req, res, next) => {
    var sql = "SELECT * FROM Users WHERE Id = ?"
    userdb.all(sql, req.params.id, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
})
  
// TEST
app.post("/api/test", auth, (req, res) => {
    res.status(200).send("Token Works - Yay!");
});

app.listen(port, () => console.log(`API listening on port ${port}!`));