var handlers = {};
handlers.write = require('./page.compose.write.js');
handlers.save = require('./page.compose.save.js');

module.exports = function(e, matchResult, rueckruf){
    function respond(err, content){
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
            handlers.save(post, respond);
        });
    } else {
        handlers.write(respond);
    };

};
