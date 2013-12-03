var routerTable = {
    '^(\/[0-9]+)?\/?\\??$': require('./page.index.js'),
    '^(\/[0-9]+)?\/msgcenter(\/(unread|incoming|outgoing))?\/?\\??$': require('./page.msgcenter.js'),
    '^(\/[0-9]+)?\/compose\/?\\??$': require('./page.compose.js'),
    '^(\/[0-9]+)?\/monitor\/?\\??$': require('./page.monitor.js'),
    '^(\/[0-9]+)?\/contact(\/(detail|add|remove))?\/?\\??$': require('./page.contact.js'),
    '^(\/[0-9]+)?\/codebook\/([0-9a-fA-F]+)(\/(detail|add|remove))?\/?\\??$': require('./page.contact.js'),
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
