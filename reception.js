/*
 * Reception Server
 *
 * This is the start up script for Reception Server, part of the kernel.
 */

require('./lib/baum.js');
CONFIG = $.config.createConfig('./config/');

function errorWriter(e, code){
    var output
        = '<html><head><title>' 
        + CONFIG.get('site-name') 
        + '</title></head><body>'
        + '<h3>' + code + ' ' + $.nodejs.http.STATUS_CODES[code] + '</h3>'
        + '</body></html>'
    ;
    e.response.writeHead(code);
    e.response.write(output);
    e.response.end();
};

var routerTable = {
    
};

var port = CONFIG.get('http-port');
var HTTPServer = $.net.HTTP.server(port);
console.log('HTTP Server created at port: ' + port);

HTTPServer.on('data', function(e){
    var handled = false;
    for(var expression in routerTable){
        var regexp = new RegExp(expression);
        var result = regexp.exec(e.response.url);
        if(null != result){
            routerTable[expression](e, result);
            handled = true;
        };
    };

    if(!handled){
        errorWriter(e, 404);
    };
});

HTTPServer.start();
