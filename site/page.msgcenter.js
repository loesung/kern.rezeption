function unread(){
};

function incoming($, queues, callback){
    $.nodejs.async.waterfall([
        queues.receive.proceeded.list,

    ], function cb(err, result){
        callback(err, String(''
        ));
    });
};

function outgoing(){
    
};

function index(callback){
    callback(null,
        String(
            '这里是消息队列。通过密码核心发送和接收的消息都将经过这一部分。'
            + '<p><strong>已收到的消息。</strong>这里查看收到的消息，可进行解密或其他操作。'
            + '<p><strong>待发送的消息。</strong>您可以在消息发送之前在此进行重新审阅，确定发送路线等。'
        )
    );
};

module.exports = function(e, matchResult, rueckruf){
    var currentPage = matchResult[3];
    var queues = _.queue(IPC['datenbank']);

    function navLink(text, target){
        if(currentPage == target)
            return '[<strong>' + text + '</strong>]';
        else
            return '[<a href="/'
                + (new Date().getTime())
                + '/msgcenter/'
                + target
                + '">'
                + text
                + '</a>]'
            ;
    };

    function contentCallback(err, content){
        if(null != err){
            content = '错误，可能是连接不到消息队列。';
        };
        outputPage(e, {
            title: '消息队列',
            content
                : [
                    navLink('未读消息',     'unread'),
                    navLink('已收到的消息', 'incoming'),
                    navLink('待发送的消息', 'outgoing')
                ].join(' ')
                + '<br />'
                + content
            ,
        });
    };

    switch(currentPage){
        case 'unread':
            unread(contentCallback);
            break;
        case 'incoming':
            incoming($, queues, contentCallback);
            break;
        case 'outgoing':
            outgoing(contentCallback);
            break;
        default:
            index(contentCallback);
            break;
    };

    rueckruf(null);
};
