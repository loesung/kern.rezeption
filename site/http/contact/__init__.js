module.exports = function(){
    var router = $.net.urlRouter();

    router
        .handle('', require('./_.js'))
    ;

    return router; 
};
