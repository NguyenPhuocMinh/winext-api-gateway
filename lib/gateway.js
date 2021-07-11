'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const fetch = require('node-fetch');
const lodash = winext.require('lodash');
const { get, isEmpty } = lodash;

fetch.Promise = Promise;

function GateWay(params = {}) {
  const config = get(params, 'config');
  const requestId = get(params, 'requestId');
  const loggerFactory = get(params, 'loggerFactory');
  const loggerTracer = get(params, 'loggerTracer');

  this.createService = async function (request, response, next) {
    console.log('createService', request.headers);
    try {
      loggerFactory.info(`function createService has been start`, {
        requestId: requestId
      });
      const response = await fetch();
    } catch (err) {
      loggerFactory.info(`function createService has error`, {
        requestId: requestId,
        args: { err }
      });
      return Promise.reject(err);
    }
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
