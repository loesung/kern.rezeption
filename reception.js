/*
 * Reception Server
 *
 * This is the start up script for Reception Server, part of the kernel.
 */

require('./lib/baum.js');
require('./lib/_.js');
CONFIG = $.config.createConfig('./config/');
SESSION = {};
IPC = {};

outputError = function(e, code, message){
    var output
        = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
        + '<html><head>'
        + '<meta http-equiv="Content-Type" content="application/html; charset=utf-8" />'
        + '<title>' + CONFIG.get('site-name') + '</title>'
        + '<style type="text/css">body{background: #FFFFFF; text-align:center;}</style>'
        + '</head><body>'
        + '<h1>' + $.nodejs.http.STATUS_CODES[code] + '</h1>'
        + '<h3>Error Code ' + code + '</h3>'
        + ((undefined == message)?('Sorry, but the server have respond with an error. This is what we all know.'):(message))
        + '<br /><hr />'
        + '<font color="#FF0000">LOESUNG-PROJECT</font> Reception Server'
        + '</body></html>'
    ;
    e.response.writeHead(code, {'Content-Type': 'text/html'});
    e.response.write(output);
    e.response.end();
};



var site = require('./site/entrance.js');
var port = CONFIG.get('http-port');
var socketPath = CONFIG.get('socket-path');

var HTTPServer = $.net.HTTP.server(port);
String('HTTP Server created at port: ' + port).NOTICE();

var IPCServer = $.net.IPC.server(socketPath);
String('IPC Server created at: ' + socketPath).NOTICE();

String('Read IPC map.').NOTICE();
var IPCMap = CONFIG.get('ipc-map');
for(var item in IPCMap){
    String(
        'Create IPC Client at [' + IPCMap[item] + '] for [' + item + '].'
    ).NOTICE();
    IPC[item] = $.net.IPC.client(IPCMap[item]);
};

String('Initialize Botschaft-System communication.').NOTICE();
$.global.set('botschaft', _.botschaft(IPC['botschaft']));
$.global.get('botschaft').refreshTunnelInfo();

HTTPServer.on('data', site);
HTTPServer.start();

IPCServer.on('data', site);
IPCServer.start();


$.nodejs.memwatch.on('leak', function(e){
    String('MEMWATCH detected potential memory leak:' + e).WARNING();
});
