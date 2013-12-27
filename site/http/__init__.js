var logicRouter = require('./logic/__init__.js')(),
    renderRouter = require('./render/__init__.js')();

module.exports = function(e, preHandle, callback){
    var logicFunc = logicRouter(e.request.url),
        renderFunc = renderRouter(e.request.url);

    if(!logicFunc) return callback(400);

    preHandle(logicFunc)(e, function(err, result){
        if(!renderFunc) callback(null, JSON.stringify(result));
        callback(null, renderFunc(result));
    });
};
