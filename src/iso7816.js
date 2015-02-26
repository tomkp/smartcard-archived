'use strict';


var Command = require('./command');
var hexify = require('./hexify');




// cla emv: 00, gsm: a0
var iso7816 = function (device) {

    console.info('iso7816', {device: device});

    function startsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }

    function stringToByteArray(str) {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i ++) {
            var hex = str.charCodeAt(i);
            arr.push(hex);
        }
        return arr;
    }





    var ins = {
        APPEND_RECORD: 0xE2,
        ENVELOPE: 0xC2,
        ERASE_BINARY: 0x0E,
        EXTERNAL_AUTHENTICATE: 0x82,
        GET_CHALLENGE: 0x84,
        GET_DATA: 0xCA,
        GET_RESPONSE: 0xC0,
        INTERNAL_AUTHENTICATE: 0x88,
        MANAGE_CHANNEL: 0x70,
        PUT_DATA: 0xDA,
        READ_BINARY: 0xB0,
        READ_RECORD: 0xB2,
        SELECT_FILE: 0xA4,
        UPDATE_BINARY: 0xD6,
        UPDATE_RECORD: 0xDC,
        VERIFY: 0x20,
        WRITE_BINARY: 0xD0,
        WRITE_RECORD: 0xD2
    };

    var selectFile = function (file) {
        console.info('iso7816.selectFile', {file: file});

        var data = stringToByteArray(file);

        var apdu = new Command({
            cla: 0x00,
            ins: ins.SELECT_FILE,
            p1: 0x04,
            p2: 0x00,
            data: data
        });
        return apdu;
    };


    var getResponse = function (length) {
        console.info('iso7816.getResponse', {length: length});

        //var data = stringToByteArray(file);

        var apdu = new Command({
            cla: 0x00,
            ins: ins.GET_RESPONSE,
            p1: 0x00,
            p2: 0x00,
            le: length
        });
        return apdu;
    };


    return {

        selectFile: selectFile,
        getResponse: getResponse
        //issueCommand: issueCommand

    }
};

module.exports = iso7816;


