function preHandle(handler){
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
    var ipc = require('./ipc/__init__.js'),
        http = require('./http/__init__.js');

    return function(callback){
        console.log(e.request.url);

        if('http' == e.protocol)
            http(e, preHandle, callback);
        else
            ipc(e, preHandle, callback);

    };
};
