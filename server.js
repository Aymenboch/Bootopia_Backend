const express = require('express');
const app = express();
const cors = require('cors');
// set up port
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({origin: true, credentials: true}))
// add routes
const router = require('./routes/router');
app.use('/api', router);
// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));








/*import express from 'express';
import sequelize from './utils/database.js';
import router from './routes/routes.js';
import cors  from 'cors';
import mysql  from 'mysql2';
import bodyParser from 'body-parser';
import {createConnection} from 'mysql2';

const app = express();

app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
/*
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(router);

sequelize.sync(); 

app.listen(5000);

const con = createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Projectiss",
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

con.query(`select * from Users`, function(err, result, fields) {
    if (err) {
        return console.log("db connection FAILED");
    }
    return console.log("Database CONNECTED!");
  })
//insert api 
app.get("/api/get", (req, res) => {
    const sqlGet = "SELECT * FROM Users";
    con.query(sqlGet, (err, result) => {
        console.log("error", err)
        console.log("result", result)
        res.send(result)
    })
})

app.listen(5000, () => { console.log("Server started on port 5000")} )*/