// @flow

// #region imports
const express = require('express');
import PrettyError from 'pretty-error';
const expressServer = require('./lib/expressServer');
const config = require('../../config');
// #endregion

// #region constants
const dev = config.get('env') !== 'production';
const pe = new PrettyError();
// #endregion

try {
  pe.start();

  const app = express();
  expressServer(app, dev);
} catch (error) {}
