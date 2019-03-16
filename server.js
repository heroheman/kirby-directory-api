const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
import db from './lib/db';

import { runCronFetch } from './lib/getItems.js';

const app = express();
app.use(helmet());
app.use(cors());

const port = 63473;

const server = app.listen(port, () => {
  console.log('Express server ready to serve. Port: ' + port + '. Bye.');
  runCronFetch();
});

server.timeout = 1000 * 60 * 10; // 10 minutes

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});

app.get('/all', (req, res) => {
  const themes = db.get('themes');
  res.send(db);
});

app.get('/themes', (req, res) => {
  const themes = db.get('themes');
  res.send(themes);
});

app.get('/plugins', (req, res) => {
  const plugins = db.get('plugins');
  res.send(plugins);
});
