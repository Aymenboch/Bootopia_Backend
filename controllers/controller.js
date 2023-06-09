const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const userMiddleware = require('../middleware/users.js');
const jwt = require('jsonwebtoken');
const db = require('../utils/database.js');

const signUp = async  (req, res, next) => {
  console.log(req.body)

    db.query(
      `SELECT * FROM users1 WHERE LOWER(username) = LOWER(${db.escape(
        req.body.username
      )});`,
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: 'This username is already in use!'
          });
        } else {
          // username is available
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err
              });
            } else {
              // has hashed pw => add to database
              db.query(
                `INSERT INTO users1 (id, username, password, registered) VALUES ('${uuid.v4()}', ${db.escape(
                  req.body.username
                )}, ${db.escape(hash)}, NOW() )`,
                (err, result) => {
                  if (err) {
                    throw err;
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  return res.status(201).send({
                    msg: 'Registered!'
                  });
                }
              );
            }
          });
        }
      }
    );
  };

  
const secretRoute = async (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
  };

const getUsers = async (request, response) => {
    try {
        db.connect(function (err) {
        if (err) throw err;
        db.query("SELECT * FROM Users", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          response.status(200).json({ user: result });
        });
      });
    } catch (error) {
      response.status(500).json({ msg: "error on getting users" });
    }
  };

const login = async (req, res, next) => {

    console.log(req.body)

    db.query(
      `SELECT * FROM users1 WHERE username = ${db.escape(req.body.username)};`,
      (err, result) => {
        // user does not exists
        if (err) {
          throw err;
          return res.status(400).send({
            msg: err
          });
        }
        if (!result.length) {
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          })
        }
        // check password
        bcrypt.compare(
          req.body.password,
          result[0]['password'],
          (bErr, bResult) => {
            // wrong password
            if (bErr) {
              throw bErr;
              return res.status(401).send({
                msg: 'Username or password is incorrect!'
              });
            }
  
            if (bResult) {
              const token = jwt.sign({
                  username: result[0].username,
                  userId: result[0].id
                },
                'SECRETKEY', {
                  expiresIn: '7d'
                }
              );
  
              db.query(
                `UPDATE users1 SET last_login = now() WHERE id = '${result[0].id}'`
              );
              return res.status(200).send({
                msg: 'Logged in!',
                token,
                user: result[0]
              });
            }
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }
        );
      }
    );
  };

  const booking = async  (req, res, next) => {
    console.log(req.body)
                db.query(
                  `INSERT INTO BookingRoom (workingSpace, room, date, time, person, note) VALUES ('${req.body.workingSpace}',
                  '${req.body.room}','${req.body.date}','${req.body.time}', '${req.body.person}', '${req.body.note}') `,
                  (err, result) => {
                    if (err) {
                      console.log("fail")
                      throw err;
                      return res.status(400).send({
                        msg: err
                      });
                    }
                    return res.status(201).send({
                      msg: 'Registered!', 
                    });
                  }
                );
              }
  

  module.exports = {
    login,
    signUp,
    secretRoute,
    getUsers,
    booking
  }