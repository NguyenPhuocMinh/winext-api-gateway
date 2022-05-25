'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const lodash = winext.require('lodash');
const fetch = winext.require('node-fetch');
const constants = require('../utils/constants');
const errorCodes = require('../config/errorCodes');
const { get, isEmpty, isEqual, find } = lodash;

const profiles = require('../conf/profiles');

function ApiGateWay(params = {}) {
  // config
  fetch.Promise = Promise;

  const config = get(params, 'config');
  const authorizationConfig = get(params, 'authorizationConfig');
  const loggerTracer = get(params, 'loggerTracer');
  const errorManager = get(params, 'errorManager');

  const kongConfig = get(config, 'kong', {});
  const kongEnable = get(kongConfig, 'enable', false);
  const kongPort = profiles.kongPort || get(kongConfig, 'port');

  const enablePaths = get(authorizationConfig, 'enablePaths');
  const publicPaths = get(authorizationConfig, 'publicPaths');
  const protectedPaths = get(authorizationConfig, 'protectedPaths');

  /**
   * ADD SERVICE
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  this.createService = async function (request, response, next) {
    try {
      loggerTracer.info(`function createService has been start`);
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.silly('function createService not enable kong gateway');
        return next();
      } else {
        const service = get(kongConfig, 'service', {});
        if (!isEmpty(service)) {
          const data = await fetch(`http://localhost:${kongPort}/services`, {
            method: 'POST',
            body: JSON.stringify(service),
            headers: { 'Content-Type': 'application/json' },
          }).then(async (resNewService) => {
            if (resNewService.status === constants.KONG_STATUS.CREATED) {
              loggerTracer.info(`function createService with response status created successfully`, {
                args: {
                  status: resNewService.status,
                  nameService: resNewService.name,
                  idService: resNewService.id,
                },
              });
              return resNewService.json();
            } else if (resNewService.status === constants.KONG_STATUS.DUPLICATED) {
              const existService = await fetch(`http://localhost:${kongPort}/services/${service.name}`).then(
                (resExistService) => {
                  if (resExistService.status === constants.KONG_STATUS.SUCCESS) {
                    return resExistService.json();
                  } else {
                    throw new Error(resExistService.json().message);
                  }
                }
              );
              if (!isEmpty(existService)) {
                loggerTracer.debug(`function createService with existService has data`, {
                  args: {
                    nameService: existService.name,
                    idService: existService.id,
                  },
                });
                return existService;
              }
            } else {
              loggerTracer.warn(
                `function createService with response status not created successfully or exist service`,
                {
                  args: { status: resNewService.status },
                }
              );
              response.status(resNewService.status).send({
                message: await resNewService.json().message,
              });
            }
          });
          if (!isEmpty(data)) {
            loggerTracer.debug(`function createService has been end with data`, {
              args: {
                nameService: data.name,
                idService: data.id,
              },
            });
            return next();
          }
        }
      }
    } catch (err) {
      loggerTracer.error(`function createService has error`, {
        args: { err },
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
      loggerTracer.info(`function createRouter has been start`);
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.silly('function createRouter not enable kong gateway');
        return next();
      } else {
        const route = get(kongConfig, 'route', {});
        if (!isEmpty(route)) {
          const data = await fetch(`http://localhost:${kongPort}/routes`, {
            method: 'POST',
            body: JSON.stringify(route),
            headers: { 'Content-Type': 'application/json' },
          }).then(async (resNewRoute) => {
            if (resNewRoute.status === constants.KONG_STATUS.CREATED) {
              loggerTracer.info(`function createService with response status created successfully`, {
                args: {
                  status: resNewRoute.status,
                  nameRoute: resNewRoute.name,
                  idRoute: resNewRoute.id,
                },
              });
              return resNewRoute.json();
            } else if (resNewRoute.status === constants.KONG_STATUS.DUPLICATED) {
              const existRoute = await fetch(`http://localhost:${kongPort}/routes/${route.name}`).then(
                (resExistRoute) => {
                  if (resExistRoute.status === constants.KONG_STATUS.SUCCESS) {
                    return resExistRoute.json();
                  } else {
                    throw new Error(resExistRoute.json().message);
                  }
                }
              );
              if (!isEmpty(existRoute)) {
                loggerTracer.debug(`function createRouter with existRoute has data`, {
                  args: {
                    status: resNewRoute.status,
                    nameRoute: existRoute.name,
                    idRoute: existRoute.id,
                  },
                });
                return existRoute;
              }
            } else {
              loggerTracer.warn(`function createRouter with response status not created successfully or exist route`, {
                args: { status: resNewRoute.status },
              });
              response.status(resNewRoute.status).send({
                message: await resNewRoute.json().message,
              });
            }
          });
          if (!isEmpty(data)) {
            loggerTracer.debug(`function createRouter has been end with data`, {
              args: {
                nameRoute: data.name,
                idRoute: data.id,
              },
            });
            return next();
          }
        }
      }
    } catch (err) {
      loggerTracer.error(`function createRouter has error`, {
        args: { err },
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
      loggerTracer.info(`function createConsumer has been start`);
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.silly('function createConsumer not enable kong gateway');
        return next();
      } else {
        const consumer = get(kongConfig, 'consumer', {});
        if (!isEmpty(consumer)) {
          const data = await fetch(`http://localhost:${kongPort}/consumers`, {
            method: 'POST',
            body: JSON.stringify(consumer),
            headers: { 'Content-Type': 'application/json' },
          }).then(async (resNewConsumer) => {
            if (resNewConsumer.status === constants.KONG_STATUS.CREATED) {
              return resNewConsumer.json();
            } else if (resNewConsumer.status === constants.KONG_STATUS.DUPLICATED) {
              const existConsumer = await fetch(`http://localhost:${kongPort}/consumers/${consumer.username}`).then(
                (resExistConsumer) => {
                  if (resExistConsumer.status === constants.KONG_STATUS.SUCCESS) {
                    return resExistConsumer.json();
                  } else {
                    throw new Error(resExistConsumer.json().message);
                  }
                }
              );
              if (!isEmpty(existConsumer)) {
                loggerTracer.debug(`function createConsumer with existConsumer has data`, {
                  args: {
                    consumerName: existConsumer.username,
                    idConsumer: existConsumer.id,
                  },
                });
                return existConsumer;
              }
            } else {
              loggerTracer.warn(
                `function createConsumer with response status not created successfully or exist consumer`,
                {
                  args: { status: resNewConsumer.status },
                }
              );
              response.status(resNewConsumer.status).send({
                message: await resNewConsumer.message,
              });
            }
          });
          if (!isEmpty(data)) {
            loggerTracer.debug(`function createConsumer has been end with data`, {
              args: {
                consumerName: data.username,
                idConsumer: data.id,
              },
            });
            return next();
          }
        }
      }
    } catch (err) {
      loggerTracer.info(`function createConsumer has error`, {
        args: { err },
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
      loggerTracer.info(`function createPlugin has been start`);
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.silly('function createPlugin not enable kong gateway');
        return next();
      } else {
        const plugin = get(kongConfig, 'plugin', {});
        if (!isEmpty(plugin)) {
          const data = await fetch(`http://localhost:${kongPort}/plugins`, {
            method: 'POST',
            body: JSON.stringify(plugin),
            headers: { 'Content-Type': 'application/json' },
          }).then(async (resNewPlugin) => {
            if (
              resNewPlugin.status === constants.KONG_STATUS.CREATED ||
              resNewPlugin.status === constants.KONG_STATUS.DUPLICATED
            ) {
              loggerTracer.debug(`function createPlugin with response status created successfully or exist plugin`, {
                args: {
                  status: resNewPlugin.status,
                },
              });
              return resNewPlugin.json();
            } else {
              loggerTracer.warn(
                `function createPlugin with response status not created successfully or exist plugin`,
                {
                  args: {
                    status: resNewPlugin.status,
                  },
                }
              );
              response.status(resNewPlugin.status).send({
                message: await resNewPlugin.json().message,
              });
            }
          });
          if (!isEmpty(data)) {
            loggerTracer.debug(`function createPlugin has been end`);
            return next();
          }
        }
      }
    } catch (err) {
      loggerTracer.error(`function createPlugin has error`, {
        args: { err },
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
      loggerTracer.info(`function authGateway has been start`);
      if (isEmpty(config) || !kongEnable) {
        loggerTracer.silly('function authGateway not enable kong gateway');
        return next();
      } else {
        const userName = get(kongConfig, 'consumer.username', {});
        const keyName = get(kongConfig, 'plugin.name');
        const keyAuth = await fetch(`http://localhost:${kongPort}/consumers/${userName}/${keyName}`, {
          method: 'POST',
        }).then(async (resKey) => {
          if (resKey.status === constants.KONG_STATUS.CREATED) {
            loggerTracer.info(`function authGateway get key auth successfully!`);
            return resKey.json();
          } else {
            loggerTracer.warn(`function authGateway get key auth not successfully!`);
            response.status(resKey.status).send({ message: await resKey.json().message });
          }
        });
        if (!isEmpty(keyAuth)) {
          loggerTracer.debug(`function authGateway has been end with key auth`, {
            args: {
              keyAuth: keyAuth.key,
              idKeyAuth: keyAuth.id,
            },
          });
          /**
           * enable path
           */
          const findEnablePath = find(
            enablePaths,
            (item) => item.pathName === request.path && item.method === request.method
          );
          /**
           * enable public path
           */
          const findPathPublic = find(
            publicPaths,
            (item) => item.pathName === request.path && item.method === request.method
          );
          const enablePublicPath = get(findPathPublic, 'enable', false);
          /**
           * enable protected path
           */
          const findProtectedPath = find(
            protectedPaths,
            (item) => item.pathName === request.path && item.method === request.method
          );
          const enableProtectedPath = get(findProtectedPath, 'enable');
          /**
           * gateway key in headers
           */
          const gatewayKeyInHeaders = request.headers['x-gateway-key'];
          if (isEmpty(gatewayKeyInHeaders)) {
            /**
             * findEnablePath
             */
            if (!isEmpty(findEnablePath)) {
              loggerTracer.debug(`function authGateway has findEnablePath`);
              return next();
            }
            /**
             * findPathPublic
             */
            if (!isEmpty(findPathPublic) && !enablePublicPath) {
              loggerTracer.debug(`function authGateway has findPathPublic and not enablePublicPath`, {
                args: { enablePublicPath: enablePublicPath },
              });
              return next();
            }
            /**
             * findProtectedPath
             */
            if (!isEmpty(findProtectedPath) && !enableProtectedPath) {
              loggerTracer.debug(`function authGateway has findProtectedPath and not enableProtectedPath`, {
                args: { enableProtectedPath: enableProtectedPath },
              });
              return next();
            }
            /**
             * not found gateway key in headers
             */
            const gatewayKeyNotFoundInHeaderError = errorManager.newError('GatewayKeyNotFoundInHeader', errorCodes);
            response.status(gatewayKeyNotFoundInHeaderError.statusCode).send({
              name: gatewayKeyNotFoundInHeaderError.name,
              message: gatewayKeyNotFoundInHeaderError.message,
            });
          } else {
            if (isEqual(keyAuth.key, gatewayKeyInHeaders)) {
              return next();
            } else {
              const gatewayKeyInvalidError = errorManager.newError('GatewayKeyInvalid', errorCodes);
              response.status(gatewayKeyInvalidError.statusCode).send({
                name: gatewayKeyInvalidError.name,
                message: gatewayKeyInvalidError.message,
              });
            }
          }
        }
      }
    } catch (err) {
      loggerTracer.error(`function authGateway has error`, {
        args: { err },
      });
      return Promise.reject(err);
    }
  };
}

exports = module.exports = new ApiGateWay();
exports.register = ApiGateWay;
