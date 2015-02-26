var request = require('request');

function startsWithTab(line) {
    return line.match(/^\t/);
}

function isComment(line) {
    return line.match(/^#/);
}

function isBlank(line) {
    return line.length <= 1;
}

var map;


function lookup(atr, fn) {
    //return function (atr, fn) {

        atr = atr.toUpperCase();

        console.info('lookup atr', atr);

        if (map) {
            var result = map[atr];
            fn(result);
        } else {
            request('http://ludovic.rousseau.free.fr/softwares/pcsc-tools/smartcard_list.txt', function (err, response, data) {

                if (err) {
                    throw err;
                }

                if (response.statusCode === 200) {

                    map = {};
                    var entry = {};

                    var lines = data.toString().split('\n');
                    lines.forEach(function (line) {

                        //console.info('>>>', line, line.length);

                        if (!startsWithTab(line) && !isBlank(line) && !isComment(line)) {
                            entry = {};
                            line = line.replace(/\s+/g, '');
                            entry.atr = line;
                            map[entry.atr] = entry;
                            return;
                        }

                        if (entry.description && isBlank(line)) {

                            // end of entry
                            return
                        }

                        if (isComment(line) || isBlank(line)) {
                            //console.info('***', line);
                            return;
                        }

                        if (startsWithTab(line)) {
                            if (!entry.description) {
                                entry.description = [];
                            }
                            entry.description.push(line.substr(1));
                        }
                    });

                    console.info('atr lookup initialised');

                    fn(map[atr]);
                }
            });
        }

   // };
}


var parse = function() {


};

module.exports = {
    lookup: lookup,
    parse: parse
};




