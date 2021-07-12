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
          const data = await fetch(`http://localhost:${kongPort}/services`, {
            method: 'POST',
            body: JSON.stringify(service),
            headers: { 'Content-Type': 'application/json' }
          })
            .then(async (resNewService) => {
              if (resNewService.status === constants.KONG_STATUS.CREATED) {
                loggerFactory.info(`function createService with response status created successfully`, {
                  requestId: requestId,
                  args: {
                    status: resNewService.status,
                    nameService: resNewService.name,
                    idService: resNewService.id
                  }
                });
                return resNewService.json();
              } else if (resNewService.status === constants.KONG_STATUS.DUPLICATED) {
                const existService = await fetch(`http://localhost:${kongPort}/services/${service.name}`)
                  .then(resExistService => {
                    if (resExistService.status === constants.KONG_STATUS.SUCCESS) {
                      return resExistService.json();
                    } else {
                      throw new Error(resExistService.json().message);
                    }
                  });
                if (!isEmpty(existService)) {
                  loggerFactory.data(`function createService with existService has data`, {
                    requestId: requestId,
                    args: {
                      nameService: existService.name,
                      idService: existService.id
                    }
                  });
                  return existService;
                }
              } else {
                loggerFactory.warn(`function createService with response status not created successfully or exist service`, {
                  requestId: requestId,
                  args: { status: resNewService.status }
                });
                response.status(resNewService.status).send({
                  message: await resNewService.json().message
                });
              }
            });
          if (!isEmpty(data)) {
            loggerFactory.data(`function createService has been end with data`, {
              requestId: requestId,
              args: {
                nameService: data.name,
                idService: data.id
              }
            });
            return next();
          }
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
            .then(async (resNewRoute) => {
              if (resNewRoute.status === constants.KONG_STATUS.CREATED) {
                loggerFactory.info(`function createService with response status created successfully`, {
                  requestId: requestId,
                  args: {
                    status: resNewRoute.status,
                    nameRoute: resNewRoute.name,
                    idRoute: resNewRoute.id
                  }
                });
                return resNewRoute.json();
              } else if (resNewRoute.status === constants.KONG_STATUS.DUPLICATED) {
                const existRoute = await fetch(`http://localhost:${kongPort}/routes/${route.name}`)
                  .then(resExistRoute => {
                    if (resExistRoute.status === constants.KONG_STATUS.SUCCESS) {
                      return resExistRoute.json();
                    } else {
                      throw new Error(resExistRoute.json().message);
                    }
                  });
                if (!isEmpty(existRoute)) {
                  loggerFactory.data(`function createRouter with existRoute has data`, {
                    requestId: requestId,
                    args: {
                      status: resNewRoute.status,
                      nameRoute: existRoute.name,
                      idRoute: existRoute.id
                    }
                  });
                  return existRoute;
                }
              } else {
                loggerFactory.warn(`function createRouter with response status not created successfully or exist route`, {
                  requestId: requestId,
                  args: { status: resNewRoute.status }
                });
                response.status(resNewRoute.status).send({
                  message: await resNewRoute.json().message
                });
              }
            });
          if (!isEmpty(data)) {
            loggerFactory.data(`function createRouter has been end with data`, {
              requestId: requestId,
              args: {
                nameRoute: data.name,
                idRoute: data.id
              }
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
        const consumer = get(kongConfig, 'consumer', {});
        if (!isEmpty(consumer)) {
          const data = await fetch(`http://localhost:${kongPort}/consumers`, {
            method: 'POST',
            body: JSON.stringify(consumer),
            headers: { 'Content-Type': 'application/json' }
          })
            .then(async (resNewConsumer) => {
              if (resNewConsumer.status === constants.KONG_STATUS.CREATED) {
                return resNewConsumer.json();
              } else if (resNewConsumer.status === constants.KONG_STATUS.DUPLICATED) {
                const existConsumer = await fetch(`http://localhost:${kongPort}/consumers/${consumer.username}`)
                  .then(resExistConsumer => {
                    if (resExistConsumer.status === constants.KONG_STATUS.SUCCESS) {
                      return resExistConsumer.json();
                    } else {
                      throw new Error(resExistConsumer.json().message);
                    }
                  });
                if (!isEmpty(existConsumer)) {
                  loggerFactory.data(`function createConsumer with existConsumer has data`, {
                    requestId: requestId,
                    args: {
                      consumerName: existConsumer.username,
                      idConsumer: existConsumer.id
                    }
                  });
                  return existConsumer;
                }
              } else {
                loggerFactory.warn(`function createConsumer with response status not created successfully or exist consumer`, {
                  requestId: requestId,
                  args: { status: resNewConsumer.status }
                });
                response.status(resNewConsumer.status).send({
                  message: await resNewConsumer.message
                });
              }
            });
          if (!isEmpty(data)) {
            loggerFactory.data(`function createConsumer has been end with data`, {
              requestId: requestId,
              args: {
                consumerName: data.username,
                idConsumer: data.id
              }
            });
            return next();
          }
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
            .then(async resNewPlugin => {
              if (resNewPlugin.status === constants.KONG_STATUS.CREATED || resNewPlugin.status === constants.KONG_STATUS.DUPLICATED) {
                loggerFactory.data(`function createPlugin with response status created successfully or exist plugin`, {
                  requestId: requestId,
                  args: {
                    status: resNewPlugin.status
                  }
                });
                return resNewPlugin.json();
              } else {
                loggerFactory.warn(`function createPlugin with response status not created successfully or exist plugin`, {
                  requestId: requestId,
                  args: {
                    status: resNewPlugin.status,
                  }
                });
                response.status(resNewPlugin.status).send({
                  message: await resNewPlugin.json().message
                });
              }
            });
          if (!isEmpty(data)) {
            loggerFactory.data(`function createPlugin has been end`, {
              requestId: requestId,
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
   * GET AUTH KEY
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  this.authGateway = async function (request, response, next) {
    try {
      loggerFactory.info(`function authGateway has been start`, {
        requestId: requestId
      });
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.warn(chalk.yellow('function authGateway not enable kong gateway'));
        return next();
      } else {
        const userName = get(kongConfig, 'consumer.username', {});
        const keyName = get(kongConfig, 'plugin.name');
        const keyAuth = await fetch(`http://localhost:${kongPort}/consumers/${userName}/${keyName}`, {
          method: 'POST',
        })
          .then(async (resKey) => {
            if (resKey.status === constants.KONG_STATUS.CREATED) {
              return resKey.json();
            } else {
              response.status(resKey.status).send({ message: await resKey.json().message });
            }
          });
        console.log("🚀 ~ file: gateway.js ~ line 352 ~ keyAuth", keyAuth)
      }
    } catch (err) {
      loggerFactory.info(`function authGateway has error`, {
        requestId: requestId,
        args: { err }
      });
      return Promise.reject(err);
    }
  };
}

exports = module.exports = new GateWay();
exports.register = GateWay;
