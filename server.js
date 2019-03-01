const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(helmet());
app.use(cors());

// const dataPlugins = require('./json/plugins.json')

const port = 63473;

const server = app.listen(port, () => {
  console.log('express server ready to serve. Port: ' + port);
});

server.timeout = 1000 * 60 * 10; // 10 minutes

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.get('/api/plugins', (req, res) => {
    // res.send(JSON.stringify(dataPlugins));
    fs.readFile('./json/plugins.json', 'utf8', (err, data) => {
        res.send(data)
    })
})

