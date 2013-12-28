var router = $.net.urlRouter();
module.exports = function(){
    router
        .sub('contact', require('./contact/__init__.js'))
        .sub('msgcenter', require('./msgcenter/__init__.js'))
        .sub('compose', require('./compose/__init__.js'))
        .sub('monitor', require('./monitor/__init__.js'))
        .sub('authenticate', require('./authenticate/__init__.js'))

        .handle('', require('./index.js')())
        .handle('static', require('./static.js')())
        .handle('stop', require('./stop.js')())
    ;
    return router;
};
