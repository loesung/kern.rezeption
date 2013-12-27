/*
handlers.get = require('./page.contact.get.js');
handlers.add = require('./page.contact.add.js');
handlers.detail = require('./page.contact.detail.js');
handlers.remove = require('./page.contact.remove.js');
*/
function callbackWrapper(callback, title){
    return function(err, content){
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
        callback(null, {
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
};

function configWrapper(subtitle){
    return function(callback){
        return callbackWrapper(callback, subtitle);
    };
};

var router = $.net.urlRouter();
var identity = _.identity(IPC['geheimdienst']);

router
    .handle('', require('./get.js')(identity, configWrapper('联系人')))
    .handle('add', require('./add.js')(identity, configWrapper('添加联系人')))
    .handle('detail', require('./detail.js')(identity, configWrapper('详细信息')))
    .handle('remove', require('./remove.js')(identity, configWrapper('删除联系人')))
;

module.exports = router;
