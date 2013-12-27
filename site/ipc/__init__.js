var logicRouter = $.net.urlRouter();
logicRouter
    .handle('', require('./index.js'))
;

module.exports = function(e, preHandle, callback){
    var logicFunc = logicRouter(e.request.url);
    var renderFunc = null;

    if(!logicFunc) return callback(400);

    preHandle(logicFunc)(e, function(err, result){
        callback(renderFunc(result));
    });
};
