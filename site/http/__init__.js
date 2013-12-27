module.exports = function(){
    var router = $.net.urlRouter();
    router
        .sub('contact', require('./contact/__init__.js')())

        .handle('', require('./index.js'))
    ;
    return router;
};
