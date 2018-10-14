"use strict";

const express = require('express');
const app = require('express')();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const config = require('config');
const sql = require('mssql');

import options from './options';

var cities = [];
var population = [];

server.listen(config.server.port, () => {
    console.log(`Server listening at port ${config.server.port}`);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

// Socket - on New connection
// https://socket.io/docs/
io.on('connection', function (socket) {
    console.log(`new connection: ${socket.id}`);

    // Socket connection welcome message
    socket.emit('hello', { hello: 'world' });

    options.xaxis.categories = ['Tokyo', 'Mumbai'];
    options.series = [{name: 'Population', data: [38001000, 25703168]}];
    options.title.text = 'Largest cities in the world';
    
    socket.emit('reload-graph', options);

    // every 30 seconds - we releod the graph
    setInterval(() => {
        socket.emit('reload-graph', options);
    }, 30000);
});

// Every 20 seconds, we send a request to the SQL Server
setInterval(() => {
    // Open Sql Server Configuration Manager,
    // and enable TCP/IP protocol from SQL Server Network Configuration
    // Port 1433

    // https://www.npmjs.com/package/mssql#asyncawait
    (async () => {
        try {
            console.log(`connecting to ${config.db.database}...`);
            let pool = await sql.connect(config.db);
            console.log(`connected to ${config.db.database}!`);
            let result = await pool.request()
                // .input('input_parameter', sql.VarChar, "") // to be called with @input_parameter
                .query('select city, population from POPULATION order by population desc');

            // rebuild cities/population arrays
            cities = [];
            population = [];

            result.recordset.forEach(city => {
                cities.push(city.city);
                population.push(city.population);
            });

            options.xaxis.categories = cities;
            options.series = [{name: 'Population', data: population}];
            options.title.text = 'Largest cities in the world';
        } catch (err) {
            console.log(err);
        } finally { 
            sql.close();
        }
    })();

    sql.on('error', err => {
        console.log(err);
    })
}, 20000);