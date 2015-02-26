'use strict';

var statusCodes = require('./iso7816-status-codes');


var response = function(buffer) {

    var data = buffer.toString('hex');

//    console.info('response', {data: data});

    var getStatusCode = function() {
        return data.substr(-4);
    };

    var getStatus = function() {
        var statusCode = getStatusCode();
        var meaning = 'Unknown';
        for (var prop in statusCodes) {
            if ( statusCodes.hasOwnProperty( prop ) ) {
                var result = statusCodes[prop];
                if (statusCode.match(prop)) {
                    meaning = result;
                    break;
                }

            }
        }
        return {
            code: statusCode,
            meaning: meaning
        };
    };

    var isOk = function() {
        return getStatusCode() === '9000';
    };

    var hasMoreBytesAvailable = function() {
        return data.substr(-4, 2) === '61';
    };

    var getNumberOfBytesAvailable = function() {
        var hexLength = data.substr(-2, 2);
        //console.info('hexLength', hexLength);
        return parseInt(hexLength, 16);
    };

    return {
        statusCode: getStatusCode,
        status: getStatus,
        isOk: isOk,
        hasMoreBytesAvailable: hasMoreBytesAvailable,
        getNumberOfBytesAvailable: getNumberOfBytesAvailable
    }
};


module.exports = response;