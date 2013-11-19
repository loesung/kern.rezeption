/*
 * Reception Server
 *
 * This is the start up script for Reception Server, part of the kernel.
 */

require('./lib/baum.js');
CONFIG = $.config.createConfig('./config/');

var port = CONFIG.get('http-port');

var HTTPServer = $.net.HTTP.server(port);
console.log('HTTP Server created at port: ' + port);

HTTPServer.on('data', function(e){
    e.response.setHeader('content-type', 'text/html');
    e.response.writeHead(200);
    e.response.write('hello');
    e.end('Here is Reception from Project Loesung.');
});

HTTPServer.start();
