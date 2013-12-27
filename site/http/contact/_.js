var handlers = {};


module.exports = function(e, matchResult, rueckruf){
    var identity = _.identity(IPC['geheimdienst']);
    var subtitle = false;


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
            case 'add':
                subtitle = "添加联系人";
                waitAndRespond(handlers.add);
                break;
            default:
                respond(null, '错误：未识别的操作命令。site/page.contact.js');
                break;
        };
    } else {
        handlers.get(identity, respond);
    };
};
