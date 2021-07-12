'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const lodash = winext.require('lodash');
const dotenv = winext.require('dotenv');
const chalk = winext.require('chalk');
const fetch = require('node-fetch');
const constants = require('../utils/constants');
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

  /**
   * ADD SERVICE
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  this.createService = async function (request, response, next) {
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
          const newService = await fetch(`http://localhost:${kongPort}/services`, {
            method: 'POST',
            body: JSON.stringify(service),
            headers: { 'Content-Type': 'application/json' }
          })
          console.log("🚀 ~ file: gateway.js ~ line 48 ~ newService", newService)
            // .then(res => {
            //   if (res.status === constants.ERROR_KONG_STATUS.CREATED) {
            //     loggerFactory.info(`function createService with response status created successfully`, {
            //       requestId: requestId,
            //       args: { status: res.status }
            //     });
            //     return res.json();
            //   } else if (res.status === constants.ERROR_KONG_STATUS.DUPLICATED) {

            //   } else {
            //     loggerFactory.warn(`function createService with response status not created successfully`, {
            //       requestId: requestId,
            //       args: { status: res.status }
            //     });
            //     response.status(401).send({
            //       name: res.name,
            //       message: res.message
            //     });
            //   }
            // });
          // if (!isEmpty(data)) {
          //   loggerFactory.info(`function createService has been end with data`, {
          //     requestId: requestId,
          //     args: { data }
          //   });
          //   return next();
          // }
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

  /**
   * ADD ROUTER
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  this.createRouter = async function (request, response, next) {
    try {
      loggerFactory.info(`function createRouter has been start`, {
        requestId: requestId
      });
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.warn(chalk.yellow('function createRouter not enable kong gateway'));
        return next();
      } else {
        const route = get(kongConfig, 'route', {});
        if (!isEmpty(route)) {
          const data = await fetch(`http://localhost:${kongPort}/routes`, {
            method: 'POST',
            body: JSON.stringify(route),
            headers: { 'Content-Type': 'application/json' }
          })
            .then(res => {
              if (res.status === 201 || res.status === 409) {
                return res.json();
              } else {
                response.status(401).send({
                  name: res.name,
                  message: res.message
                });
              }
            });
          if (!isEmpty(data)) {
            loggerFactory.info(`function createRouter has been end with data`, {
              requestId: requestId,
              args: { data }
            });
            return next();
          }
        }
      }
    } catch (err) {
      loggerFactory.error(`function createRouter has error`, {
        requestId: requestId,
        args: { err }
      });
      return Promise.reject(err);
    }
  };

  /**
   * ADD PLUGIN
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  this.createPlugin = async function (request, response, next) {
    try {
      loggerFactory.info(`function createPlugin has been start`, {
        requestId: requestId
      });
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.warn(chalk.yellow('function createPlugin not enable kong gateway'));
        return next();
      } else {
        const plugin = get(kongConfig, 'plugin', {});
        if (!isEmpty(plugin)) {
          const data = await fetch(`http://localhost:${kongPort}/plugins`, {
            method: 'POST',
            body: JSON.stringify(plugin),
            headers: { 'Content-Type': 'application/json' }
          })
            .then(res => {
              if (res.status === 201 || res.status === 409) {
                return res.json();
              } else {
                response.status(401).send({
                  name: res.name,
                  message: res.message
                });
              }
            });
          if (!isEmpty(data)) {
            loggerFactory.info(`function createPlugin has been end with data`, {
              requestId: requestId,
              args: { data }
            });
            return next();
          }
        }
      }
    } catch (err) {
      loggerFactory.error(`function createPlugin has error`, {
        requestId: requestId,
        args: { err }
      });
      return Promise.reject(err);
    }
  };

  /**
   * ADD CONSUMER
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  this.createConsumer = async function (request, response, next) {
    try {
      loggerFactory.info(`function createConsumer has been start`, {
        requestId: requestId
      });
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.warn(chalk.yellow('function createConsumer not enable kong gateway'));
        return next();
      } else {
        const plugin = get(kongConfig, 'plugin', {});
        if (!isEmpty(plugin)) {
          const data = await fetch(`http://localhost:${kongPort}/routes`, {
            method: 'POST',
            body: JSON.stringify(plugin),
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    } catch (err) {
      loggerFactory.info(`function createConsumer has error`, {
        requestId: requestId,
        args: { err }
      });
      return Promise.reject(err);
    }
  };

  /**
   * GET AUTH KEY
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  this.authGateway = function (request, response, next) {

  };
}

exports = module.exports = new GateWay();
exports.register = GateWay;
