const express = require('express')
const tl = require('express-tl')
const chokidar = require('chokidar');
var findRemoveSync = require('find-remove')
var glob = require("glob");
var os = require('os');
var fs = require('fs');
var util = require('util');
var Zip = require('node-7z-forall');
const fscopy = require('fs-extra');
var parse = require('csv-parse');
const child_process = require('child_process');
var path = require('path');
var http = require('http').Server(app);
var PubNub = require('pubnub');
var uiFolder = 'AdminLTE-2.4.15';
var app = express()
var jsonConfig = fs.readFileSync('./AdminLTE-2.4.15/config/config.json');
var config = JSON.parse(jsonConfig);
var io = require('socket.io', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] }).listen(app.listen(config['listenport']));
var YSE300 = [];
var YSE301 = [];
var YSE302 = [];
var NEWDATA = [];
const opts = {
		logDirectory:'./log', // NOTE: folder must exist and be writable...
        fileNamePattern:'Market-Information-<DATE>.log',
        dateFormat:'YYYY.MM.DD'
};
const log = require('simple-node-logger').createRollingFileLogger( opts );




app.engine('tl', tl)
app.set('views', './' + uiFolder) // specify the views directory
app.set('view engine', 'tl') // register the template engine

const router = express.Router();

// Something to use when events are received.
//const log = console.log.bind(console);

// define middleware function for log

// calls logger:middleware for each request-response cycle
//app.use(log)

//load AdminLTE-2 Folder
app.use(express.static(uiFolder));



router.get('/MarketBoardInfo', function(req, res) {

    res.sendFile(path.join(__dirname + "/" + uiFolder + "/" + 'index.html'), {
        name: 'hello'
    });
});
app.use('/', router);

function YSE_data(data) {
    var filter_column = [];
    //console.log("data=>"+data);
    // var YSX300_exclude = (config['header.length'] - config['yse_column'].length);
    for (var j = 0; j < config['yse_column'].length; j++) {
        if (typeof data[config['yse_column'][j]] == "undefined") {
            filter_column += "-";
        } else {

            filter_column += data[config['yse_column'][j]];
        }
        if (j != (config['yse_column'].length - 1)) {
            filter_column += ',';
        }


    }

    //console.log('yse300 function ==>'+filter_column);
    filter_column += '\n';
    return filter_column;
}

function getFileContent(Text, Filename) {


    //Split all the text into seperate lines on new lines and carriage return feeds
    var allTextLines = Text.split(/\r\n|\n/);

    //Split per line on tabs and commas
    var headers = allTextLines[0].split(/\t|,/);
    // console.log('header####' + headers);
    var lines = [];
    var locations = [];
    var filter_column = [];
	
    if (Filename.includes("YSE300")) {
		var arr = [];
        var Temp_data = Text.split(/\r\n|\n/);
for (var j = 0; j < config['companyList'].length; j++) {
	
            for (var i = 0; i < Temp_data.length; i++) {
                var data = Temp_data[i].split(/\t|,/);
                if (data[0].includes(config['companyList'][j]['code'])) {
				highprice = data[3];
                lowprice =  data[6]; 
				price = data[9];
				closingprice = data[11];
				turnover = data[13];
				tradeamount = data[14];
                }

            }

            arr += config['companyList'][j]['code'];
            arr += ",";
			arr += "-,-,"
            arr += highprice;
            arr += ",";
            arr += "-,-,"
            arr += lowprice;
            arr += ",";
			arr += "-,-,"
            arr += price;
            arr += ",";
            arr += "-,";
			arr += closingprice;
			arr += ",";
            arr += "-";
			arr += turnover;
            arr += ",";
			arr += tradeamount;
			arr += ",";
			arr += "-,";
            if (j < config['companyList'].length) {
                arr += "\n";
            }
           
        }
		YSE300 = arr.split(/\r\n|\n/);
		 console.log("YSE300+++++>" + YSE300);
    }

    if (Filename.includes("YSE301")) {
        var customer_count = 0;
        var sell_qty = 0;
        var buy_qty = 0;

        var arr = [];
        var Temp_data = Text.split(/\r\n|\n/);
        for (var j = 0; j < config['companyList'].length; j++) {
	
            for (var i = 0; i < Temp_data.length; i++) {
                var data = Temp_data[i].split(/\t|,/);
                if (data[0].includes(config['companyList'][j]['code'])) {

                    customer_count = customer_count + 1;
                    if (data[5] == "" || typeof data[5] == "undefined" || data[5] == null) {
                        sell_data = 0;
                    } else {
                        sell_data = data[5];
                    }
                    sell_qty = sell_qty + parseInt(sell_data);

                    if (data[6] == "" || typeof data[6] == "undefined" || data[6] == null) {
                        buy_data = 0;
                    } else {
                        buy_data = data[6];
                    }
                    buy_qty = buy_qty + parseInt(buy_data);

                }

            }

            arr += config['companyList'][j]['code'];
            arr += ",";
            arr += customer_count;
            arr += ",";
            arr += "-,-,-,"
            arr += sell_qty;
            arr += ",";
            arr += buy_qty;
            arr += ",";
            arr += "-";
            if (j < config['companyList'].length) {
                arr += "\n";
            }
            customer_count = 0;
            sell_qty = 0;
            buy_qty = 0;
        }
        YSE301 = arr.split(/\r\n|\n/);;
        console.log("YSE301+++++>" + YSE301);
    }
    if (Filename.includes("YSE302")) {
        var arr = [];
        var Temp_data = Text.split(/\r\n|\n/);
for (var j = 0; j < config['companyList'].length; j++) {
	
            for (var i = 0; i < Temp_data.length; i++) {
                var data = Temp_data[i].split(/\t|,/);
                if (data[0].includes(config['companyList'][j]['code'])) {
				price = data[1];
               
                }

            }

            arr += config['companyList'][j]['code'];
            arr += ",";
			arr += price;
			arr += ",";
			arr += "-,"
            
            if (j < config['companyList'].length) {
                arr += "\n";
            }
           
        }
		YSE302 = arr.split(/\r\n|\n/);
		 console.log("YSE302+++++>" + YSE302);
    }

    if (YSE300.length == 0) {

        YSE300_DATA = [];
        for (var i = 0; i < (allTextLines.length - 1); i++) {
            for (var j = 0; j < config['yse300_column_length']; j++) {
                if (j != (config['yse300_column_length'] - 1)) {
                    YSE300_DATA[i] += '-,';
                } else {
                    YSE300_DATA[i] += '-';
                }
            }
        }
        YSE300 = YSE300_DATA;
    }
    if (YSE301.length == 0) {

        YSE301_DATA = [];
        for (var i = 0; i < (allTextLines.length - 1); i++) {
            for (var j = 0; j < config['yse301_column_length']; j++) {

                if (j != (config['yse301_column_length'] - 1)) {
                    YSE301_DATA[i] += '-,';
                } else {
                    YSE301_DATA[i] += '-';
                }
            }
        }
        YSE301 = YSE301_DATA;
    }
    if (YSE302.length == 0) {

        YSE302_DATA = [];
        for (var i = 0; i < (allTextLines.length - 1); i++) {
            for (var j = 0; j < config['yse302_column_length']; j++) {
                if (j != (config['yse302_column_length'] - 1)) {
                    YSE302_DATA[i] += '-,';
                } else {
                    YSE302_DATA[i] += '-';
                }
            }
        }
        YSE302 = YSE302_DATA;
    }


    for (var i = 0; i < config['companyList'].length; i++) {

        NEWDATA[i] = YSE300[i] + ',';
        NEWDATA[i] += YSE301[i] + ',';
        NEWDATA[i] += YSE302[i];
    }



    for (var i = 0; i < NEWDATA.length; i++) {
        filter_column += config['companyList'][i]['company']
        filter_column += ',';
        var data = NEWDATA[i].split(/\t|,/);
        filter_column += YSE_data(data);
    }


    var filter_allTextLines = filter_column.split(/\r\n|\n/);

    for (var k = 0; k < filter_allTextLines.length; k++) {
        var filter_data = filter_allTextLines[k].split(/\t|,/);

        var json_data = readHeaderInfo("no", filter_data);

        var location = json_data;
        locations.push(location);


    }

    return locations;
}


function fileCopy(filename, socket) {
   fscopy.copy(config['fileserver']+filename, config['extractdir'] + filename)
.then(() => {
  console.log('success!');
  extractZip(filename, socket);
})
.catch(err => {
  console.error(err)
})
   
    /* var dest = config['fileserver'];
    var copyFile = util.promisify(fs.copyFile);
    copyFile(
        dest + filename,
        config['extractdir'] + filename,
        fs.constants.COPYFILE_FICLONE
    ).then(function() {
        //console.log(out.stdout);
        extractZip(filename, socket);
    }, function(err) {
        console.error(err);
    }) */

}

function extractZip(filename, socket) {


    var myTask = new Zip();
    myTask.extractFull(config['extractdir'] + filename, config['extractdir'], {
            p: config['zippwd']
        })

        // Equivalent to `on('data', function (files) { // ... });`
        .progress(function(files) {
			log.info('Some files are extracted:' + files);
            //console.log('Some files are extracted: %s', files);
        })

        // When all is done
        .then(function() {
			log.info('Extracting done!');
            //console.log('Extracting done!');
            readFile(filename, socket, "no");

        })

        // On error
        .catch(function(err) {
            //console.error(err);
			if(err) {
			log.error('Extract failed!');
			}
        })


}

function readHeaderInfo(initial_flag, header_data) {

    var json = "{";
    for (var i = 0; i < header_data.length; i++) {

        if (initial_flag == "yes") {
            if (i == (header_data.length - 1)) {
                json += "\"" + i + "\" : \"" + "-" + "\"";
            } else {
                json += "\"" + i + "\" : \"" + "-" + "\", ";
            }
        } else {
            if (i == (header_data.length - 1)) {

                json += "\"" + i + "\" : \"" + header_data[i] + "\"";
            } else {

                json += "\"" + i + "\" : \"" + header_data[i] + "\", ";
            }
        }
    }
    json += "}";
    var json_data = JSON.parse(json);
    return json_data;
}

function readFile(filename, socket, initial) {
    var zipfile = filename;
    var contents = [];
    if (initial == "no") {
        var file = filename.slice(0, -4);
    } else {
        var file = filename;
    }
    var content = fs.readFileSync(config['extractdir'] + file, 'utf8');

    var splitData = [];
    var result = [];
    var resultData;
    splitData = content.replace(/\|/g, ",");

    result = getFileContent(splitData, filename);

    //var json_data = readHeaderInfo("no", config['header']);
    resultData = {

        YSEData: result

    }
    
    glob(
        '*.zip', {
            cwd: path.resolve(process.cwd(), config['extractdir'])
        }, // you want to search in parent directory
        (err, files) => {
            if (err) {
                throw err;
            }

            if (files.length) {
                fs.unlink(config['extractdir'] + zipfile, function(err) {
                    // if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log(zipfile + ' deleted!');
                });
            }

            if (file.includes("YSE300")) {
                console.log('Include 300');
                var result = findRemoveSync(config['extractdir'], {
                    prefix: 'YSE300_',
                    ignore: file
                })
            }
            if (file.includes("YSE301")) {
                console.log('Include 301');
                var result = findRemoveSync(config['extractdir'], {
                    prefix: 'YSE301_',
                    ignore: file
                })
            }
            if (file.includes("YSE302")) {
                console.log('Include 302');
                var result = findRemoveSync(config['extractdir'], {
                    prefix: 'YSE302_',
                    ignore: file
                })
            }
        });

    socket.emit('news', resultData)


}

io.on('connection', function(socket) {
    var strData;
    var csvdata = [];
    var initial_filedata = [];
    console.log('connected..');
    glob(
        '*.data', {
            cwd: path.resolve(process.cwd(), config['extractdir'])
        }, // you want to search in parent directory
        (err, files) => {
            if (err) {
                throw err;
            }

            if (files.length) {
                var file = path.basename(config['extractdir'] + files);
                initial_filedata = file.split(",");

                for (var j = 0; j < initial_filedata.length; j++) {
                    readFile(initial_filedata[j], socket, "yes");
                }

            } else {
                var initial_info = readHeaderInfo("yes", config['yse_column']);
                var initial_data = initial_info;
                csvdata.push(initial_data);

                var json_data = readHeaderInfo("no", config['yse_column']);

                strData = {

                    //YSEHeader: json_data,
                    YSEData: csvdata

                }

                socket.emit('news', strData);

            }
        }
    );

fs.watch(config['fileserver'], (event, filename) => {
	     console.log('connected..');
 console.log('event is: ' + event);
        var ext = path.extname(filename);

        if (ext == ".zip") {
            if (filename) {
				
				
                console.log('new file found' + filename);

                fileCopy(filename, socket);
				
            }
        }
	});

});
/////////////////////////////////////////////////////////////////////