/*
 * Reception Server
 *
 * This is the start up script for Reception Server, part of the kernel.
 */

require('./lib/baum.js');
CONFIG = $.config.createConfig('./config/');

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

var HTTPServer = $.net.HTTP.server(port);
console.log('HTTP Server created at port: ' + port);

HTTPServer.on('data', site);
HTTPServer.start();
