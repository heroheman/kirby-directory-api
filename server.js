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
  // runCronFetch();
});

server.timeout = 1000 * 60 * 10; // 10 minutes

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});

app.get('/all', (req, res) => {
  res.send(db);
});

app.get('/id/:issueId', (req, res) => {
  const issueId = parseInt(req.params.issueId);
  const resThemes = db.get('themes').find({id: issueId}).value();
  const resPlugins = db.get('plugins').find({id: issueId}).value();
  res.send(resThemes || resPlugins);
});

app.get('/plugin/:issueId', (req, res) => {
  const issueId = req.params.issueId;
  res.send(issueId);
});

app.get('/themes', (req, res) => {
  const themes = db.get('themes');
  res.send(themes);
});

app.get('/plugins', (req, res) => {
  const plugins = db.get('plugins');
  res.send(plugins);
});
