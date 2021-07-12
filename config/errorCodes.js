'use strict';

const errorCodes = {
  GatewayKeyNotFoundInHeader: {
    message: 'X-GateWay-Key not found in headers',
    returnCode: 3001,
    statusCode: 401
  },
  GatewayKeyInvalid: {
    message: 'X-GateWay-Key invalid',
    returnCode: 3002,
    statusCode: 400
  },
};

module.exports = errorCodes;
