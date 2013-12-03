var handlers = {};

handlers.list = function(identity, callback){
    $.nodejs.async.waterfall([
        identity.list,

        function(json, callback){
            callback(null, JSON.stringify(json));
        },

    ], callback);
};

module.exports = function(e, matchResult, rueckruf){
    var identity = _.identity(IPC['datenbank']);

    function respond(err, content){
        if(null != err){
            content = '错误：无法连接到数据中心。';
        };
        outputPage(e, {
            title: '联系人',
            content
                : [
                ].join(' ')
                + '<br />'
                + content
            ,
        });
    };

    if(e.method == 'post'){
    } else {
        handlers.list(identity, respond);
    };
};
