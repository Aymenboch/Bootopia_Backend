import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const signup = (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
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
                `INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}', ${db.escape(
                  req.body.username
                )}, ${db.escape(hash)}, now())`,
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



const login = (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
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
            });
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
                  `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
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

const getUsers = async (request, response) => {
    try {
      con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM Users", function (err, result, fields) {
          if (err) throw err;
          console.log(err);
          console.log(result);
          response.status(200).json({ users: result });
        });
      });
    } catch (error) {
      response.status(500).json({ msg: "error on getting student" });
    }
  };

export { signup, login, getUsers };