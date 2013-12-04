var handlers = {};
handlers.write = require('./page.compose.write.js');
handlers.save = require('./page.compose.save.js');

module.exports = function(e, matchResult, rueckruf){
    var queues = _.queue(IPC['datenbank']);

    function respond(err, content){
        if(null != err){
            if(!$.types.isString(content))
                content = '错误：无法连接到数据中心。';
            content = '<br />'
                + content
                + '<form method="GET" action="/' + (new Date().getTime()) + '/compose">'
                +   '<button class="navbutton btn-active" type="submit">返回</button>'
                + '</form>'
            ;
        };
        outputPage(e, {
            title: '撰写消息',
            content
                : content,
            head
                : '<style type="text/css">'
                +   'form textarea{background: #FFFFCC}'
                + '</style>'
            ,
        });
        rueckruf(null);
    };

    if('post' == e.method){
        e.on('ready', function(post){
            handlers.save(queues, post, respond);
        });
    } else {
        handlers.write(respond);
    };

};
