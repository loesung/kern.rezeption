var routerTable = {
    '^\/$': require('./page.index.js'),
};

module.exports = function(e){
    var handled = false;
    for(var expression in routerTable){
        var regexp = new RegExp(expression);
        var result = regexp.exec(e.request.url);
        if(null != result){
            routerTable[expression](e, result);
            handled = true;
            break;
        };
    };

    if(!handled){
        outputError(e, 404);
    };
};
