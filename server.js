const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
import db from './lib/db';
import './lib/cron';


import { runCronFetch } from './lib/getItems.js';

const app = express();
app.use(helmet());
app.use(cors());

const port = 63473;

const server = app.listen(port, () => {
  console.log('Express server ready to serve. Port: ' + port + '. Bye.');
});

server.timeout = 1000 * 60 * 10; // 10 minutes

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});

app.get('/all', (req, res) => {
  const items = db.get('items');
  res.send(items);
});

app.get('/id/:issueId', (req, res) => {
  const issueId = parseInt(req.params.issueId);
  const result = db.get('items').find({id: issueId}).value();
  res.send(result);
});

app.get('/plugin/:issueId', (req, res) => {
  const issueId = req.params.issueId;
  res.send(issueId);
});

app.get('/themes', (req, res) => {
  const themes = db.get('items').filter({item_type: 'themes'});
  res.send(themes);
});

app.get('/plugins', (req, res) => {
  const plugins = db.get('items').filter({item_type: 'plugins'});
  res.send(plugins);
});

app.get('/lastupdated', (req, res) => {
  res.send(db.get('last_updated'));
});

app.get('/resetDatabase', (req, res) => {
  runCronFetch();
  res.send('Done. Check /lastupdated');
});
