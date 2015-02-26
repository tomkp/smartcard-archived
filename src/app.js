'use strict';

var device = require('./device');
var iso7816 = require('./iso7816');



device.on('device-activated', function (reader) {
    console.info('Device activated', {reader: reader});
});

device.on('device-deactivated', function (reader) {
    console.info('Device deactivated', {reader: reader});
});

device.on('card-inserted', function (card) {
    console.info('Card inserted', {card: card});

    var atr = card.getAtr();
    console.info('atr:', atr);

    card.findApplications();
});

device.on('card-removed', function (reader) {
    console.info('Card removed', {reader: reader});
});

device.on('data-received', function (data) {
    console.info('Data received', {data: data.toString()});
});

device.on('error', function (error) {
    console.info('Error', {error: error});
});



