var routerTable = {
    '^(\/[0-9]+)?\/?\\??$': require('./page.index.js'),
    '^(\/[0-9]+)?\/msgcenter(\/(incoming|outgoing))?\/?\\??$': require('./page.msgcenter.js'),
    '^(\/[0-9]+)?\/monitor\/?\\??$': require('./page.monitor.js'),
    '^(\/[0-9]+)?\/log\/?\\??$': require('./page.log.js'),

    '^\/static\/([0-9a-zA-Z\.\-]+)$': require('./page.static.js'),
};

module.exports = function(e){
    return function(callback){
        var handled = false;
        for(var expression in routerTable){
            var regexp = new RegExp(expression);
            var result = regexp.exec(e.request.url);
            if(null != result){
                routerTable[expression](e, result, callback);
                return;
            };
        };
        callback(true);
    };
};
