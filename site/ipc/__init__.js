module.exports = function(){
    var router = $.net.urlRouter();
    router
        .handle('', require('./index.js'))
    ;
    return router;
};
