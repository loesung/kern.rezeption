var handlers = {};

handlers.get = require('./page.contact.get.js');
handlers.detail = require('./page.contact.detail.js');
handlers.remove = require('./page.contact.remove.js');

module.exports = function(e, matchResult, rueckruf){
    var identity = _.identity(IPC['datenbank']);
    var subcommand = matchResult[3];
    var subtitle = false;

    function respond(err, content){
        if(null != err){
            if(!$.types.isString(content))
                content = '错误：无法连接到数据中心。';
            content = '<br />'
                + content
                + '<form method="GET" action="/' + (new Date().getTime()) + '/contact">'
                +   '<button class="navbutton btn-active" type="submit">返回</button>'
                + '</form>'
            ;
        };
        outputPage(e, {
            title: '联系人' + (subtitle?' > ' + subtitle:''),
            content: content,
            head
                : '<style type="text/css">'
                  + 'input[type="hidden"]{display: none}'
                  + 'td{word-break:break-all}'
                  + '.report{border: #CCCCCC 1px solid; width: 100%}'
                  + '.report td{border: #CCCCCC 0.5px solid;}'
                  + '.report .head{background: #CCCCCC;}'
                  + '.report button,input{font-size: 9pt; text-align: center; background: #FFAAAA;}'
                + '</style>'
        });
    };

    if(e.method == 'post'){
        function waitAndRespond(handler){
            e.on('ready', function(post){
                handler(identity, post, respond);
            });
        };
        switch(subcommand){
            case 'detail':
                subtitle = "详细信息";
                waitAndRespond(handlers.detail);
                break;
            case 'remove':
                subtitle = "删除联系人";
                waitAndRespond(handlers.remove);
                break;
            default:
                respond(null, '错误：未识别的操作命令。site/page.contact.js');
                break;
        };
    } else {
        handlers.get(identity, respond);
    };
};
