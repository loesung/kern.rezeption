var router = $.net.urlRouter();
module.exports = function(){
    router
        .sub('contact', require('./contact/__init__.js'))
        .sub('msgcenter', require('./msgcenter/__init__.js'))
        .sub('compose', require('./compose/__init__.js'))

        .handle('', require('./index.js'))
    ;
    return router;
};
