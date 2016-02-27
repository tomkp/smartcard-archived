'use strict';


var iso7816 = require('./iso7816');
var response = require('./response');
var hexify = require('./hexify');
var emvTags = require('./emv-tags');
var tlv = require('tlv');



var card = function (device, reader, status) {

    console.info('card', {device: device, reader: reader, status: status});

    var iso = iso7816(reader);

    console.info('iso', iso);


    var findApplications = function () {
        console.info('card.findApplications');

        var selectFileCommand = iso.selectFile('1PAY.SYS.DDF01');

        issueCommand(selectFileCommand);

    };


    var getAtr = function () {
        console.info('card.getAtr');
        return status.atr;
    };


    var parse = function(data) {
        var parsedTlv = tlv.parse(data);
        return tlvToString(parsedTlv);
    };

    var tlvToString = function(data) {
        //console.info('tag', data.tag.toString(16), 'value', data.value);
        var value = data.value;
        var str = '[' + emvTags[data.tag.toString(16).toUpperCase()] + ']' + (value instanceof Array?'\n':value);
        if (data.value && Array.isArray(data.value)) {
            data.value.forEach(function (child) {
                str +=  '\t' + tlvToString(child);
            })
        }
        str  += '\n';
        return str;
    };



    var issueCommand = function (command) {

        //console.info('card.issueCommand', {command: command});
        //console.info('reader', reader);
        console.log('card.issueCommand', {command: command.toString()});

        device.issueCommand(command, function (err, data) {

            if (err) {
                console.log(err);
            } else {
                //console.info('data!', data, data.length, data[0]);
                //var response = data.toString('hex');
                console.info('data-received', data.toString('hex'));

                var resp = response(data);
                console.info('status code', resp.statusCode(), resp.status());

                if (resp.hasMoreBytesAvailable()) {
                    var available = resp.getNumberOfBytesAvailable();

                    device.issueCommand(iso.getResponse(available), function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.info('data-received', data.toString(), data.toString('hex'));
                            var dataStr = data.toString('hex');
                            console.info('data:', dataStr);

                            console.info('', parse(data));
                        }
                    });
                }
            }
        })
    };

    return {
        findApplications: findApplications,
        getAtr: getAtr,
        issueCommand: issueCommand
    }
};


module.exports = card;
