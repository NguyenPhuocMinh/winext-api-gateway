'use strict';

const winext = require('winext');
const dotenv = winext.require('dotenv');
dotenv.config();

const kongPort = process.env.KONG_PORT;

const profiles = {
  kongPort,
};

module.exports = profiles;
