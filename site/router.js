/*
var httpRouterTable = {
    '^(\/[0-9]+)?(\/home)?\/?\\??$': require('./page.index.js'),
    '^(\/[0-9]+)?\/msgcenter((\/(encrypted|decrypted|ciphertext|plaintext))(\/([0-9a-f\.\-]+)(\/(do|send|remove|codebook|passphrase|sign))?)?)?\/?\\??$': 
        require('./page.msgcenter.js'),
    '^(\/[0-9]+)?\/compose\/?\\??$': require('./page.compose.js'),
    '^(\/[0-9]+)?\/monitor\/?\\??$': require('./page.monitor.js'),
    '^(\/[0-9]+)?\/contact(\/(detail|add|remove))?\/?\\??$': require('./page.contact.js'),
    '^(\/[0-9]+)?\/codebook\/([0-9a-fA-F]+)(\/(detail|add|remove))?\/?\\??$': require('./page.contact.js'),
    '^(\/[0-9]+)?\/log\/?\\??$': require('./page.log.js'),
    '^(\/[0-9]+)?\/tunnel(\/([0-9a-fA-F]+))?\/?\\??$': require('./page.tunnel.js'),

    '^\/static\/([0-9a-zA-Z\.\-]+)$': require('./page.static.js'),
};


var ipcRouterTable = {
    '^(\/[0-9]+)?\/?\\??$': require('./ipc.index.js'),
};
*/

function callHandler(handler){
    return function(e, callback){
        var options = handler.__options;
        var data = {
            get: $.nodejs.querystring.parse(
                $.nodejs.url.parse(e.request.url).query
            ),
            post: {},
        };

        // deal with http method.
        var methods = ['post', 'get'];
        if(options && options.methods)
            methods = options.methods;
        if(methods.indexOf(e.method) < 0)
            return callback(405);
        if('post' == e.method){
            e.on('ready', function(post){
                data.post = post.parsed; // raw data is not passed.
                handler(data, callback);
            });
        } else {
            handler(data, callback);
        };
    };
};


module.exports = function(e){
    $.global.set('httpRouter', $.net.urlRouter());
    $.global.set('ipcRouter', $.net.urlRouter());

    $.global.get('httpRouter')
        .handle('', require('./http/index.js'))
        .sub('contact', require('./http/contact/__init__.js')())
    ;

    return function(callback){
        var handler;
        console.log(e.request.url);

        if('http' == e.protocol)
            handler = $.global.get('httpRouter')(e.request.url);
        else
            handler = $.global.get('ipcRouter')(e.request.url);

        if(!handler) return callback(400);
        callHandler(handler)(e, callback);
    };
};
