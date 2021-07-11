'use strict';

const winext = require('winext');
const lodash = winext.require('lodash');
const { get, isEmpty } = lodash;

function GateWay(params = {}) {
  const config = get(params, 'config');
  const kongConfig = get(config, 'kong');

  this.createService = function (request, response, next) {

  };

  this.createRouter = function (request, response, next) {

  };

  this.createConsumer = function (request, response, next) {

  };

  this.authGateway = function (request, response, next) {

  };
}

exports = module.exports = new GateWay();
exports.register = GateWay;
