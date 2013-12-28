var logicRouter = require('./logic/__init__.js')(),
    renderRouter = require('./render/__init__.js')();

module.exports = function(e, preHandle, callback){
    var logicFunc = logicRouter(e.request.url),
        renderFunc = renderRouter(e.request.url);

    if(!logicFunc) return callback(400);

    preHandle(logicFunc)(e, function(err, result){ 
        // (err, result) corresponds to the parameter for each handler.
        if(302 == err || 418 == err) return callback(err, result);
        if(401 == err){
            return callback(
                302,
                '/authenticate/?' + $.nodejs.querystring.stringify({
                    'redirect': result,
                })
            );
        };
        if(!renderFunc) return callback(null, JSON.stringify(result));
        return callback(null, renderFunc(result));
    });
};
