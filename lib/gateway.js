'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const lodash = winext.require('lodash');
const dotenv = winext.require('dotenv');
const chalk = winext.require('chalk');
const fetch = require('node-fetch');
const { get, isEmpty } = lodash;

function GateWay(params = {}) {
  // config
  dotenv.config();
  fetch.Promise = Promise;

  const config = get(params, 'config');
  const requestId = get(params, 'requestId');
  const loggerFactory = get(params, 'loggerFactory');
  const loggerTracer = get(params, 'loggerTracer');

  const kongConfig = get(config, 'kong', {});
  const kongEnable = get(kongConfig, 'enable', false);
  const kongPort = get(kongConfig, 'port') || process.env.KONG_PORT;

  this.getServices = async function (request, response, next) {
    try {
      loggerFactory.info(`function createService has been start`, {
        requestId: requestId
      });
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.warn(chalk.yellow('function createService not enable kong gateway'));
        return next();
      } else {
        const services = await fetch(`http://localhost:${kongPort}/services`).then(res => res.json());
        console.log("🚀 ~ file: gateway.js ~ line 35 ~ services", services);
      }
    } catch (err) {
      loggerFactory.error(`function getServices has error`, {
        requestId: requestId,
        args: { err }
      });
      return Promise.reject(err);
    }
  };

  this.createService = async function (request, response, next) {
    console.log('createService', request.headers);
    try {
      loggerFactory.info(`function createService has been start`, {
        requestId: requestId
      });
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.warn(chalk.yellow('function createService not enable kong gateway'));
        return next();
      } else {
        const service = get(kongConfig, 'service', {});
        if (!isEmpty(service)) {
          // const response = await fetch(`http://localhost:${kongPort}/services`, {
          //   method: 'POST',
          //   body: JSON.stringify(service),
          //   headers: { 'Content-Type': 'application/json' }
          // })
          // .then(res => res.json());
        }
      }
    } catch (err) {
      loggerFactory.error(`function createService has error`, {
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
