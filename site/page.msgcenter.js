var handlers = {
    plaintext: require('./page.msgcenter.plaintext.js'),
};

function index(callback){
    callback(null,
        String(
            '这里是消息队列。通过密码核心发送和接收的消息都将经过这一部分。'
            + '<br /><strong>发送消息</strong>：在“撰写消息”后，请选择“尚未加密”部分处理撰写后以明文保存在系统中的文字，对其加密，然后送入“准备发送”栏目中。'
            + '在“准备发送”部分，您可以选择用来发送这条信息的信道。'
            + '<p><strong>待发送的消息。</strong>您可以在消息发送之前在此进行重新审阅，确定发送路线等。'
        )
    );
};

module.exports = function(e, matchResult, rueckruf){
    var subcommand = matchResult[4],
        parameter = matchResult[6],
        action = matchResult[8];
    var queues = _.queue(IPC['datenbank']);

    function navLink(text, target){
        if(subcommand == target)
            return '[<font color="#FF0000">' + text + '</font>]';
        else
            return '[<a href="/' + (new Date().getTime())
                + '/msgcenter/' + target + '">' + text + '</a>]'
            ;
    };

    function respond(err, content){
        if(302 == err){
            console.log(content);
            e.response.writeHead(
                302,
                {Location: '/' + (new Date().getTime()) + content}
            );
            e.response.end();
            return;
        };
        if(null != err){
            if(!content)
                content = '错误，可能是连接不到消息队列。';
        };
        outputPage(e, {
            title: '消息队列',
            content
                : [
                    '<strong>收到的消息</strong>',
                    navLink('尚未解密', 'ciphertext'),
                    navLink('已经解密', 'decrypted'),
                    ':: ::',
                    '<strong>发出的消息</strong>',
                    navLink('尚未加密', 'plaintext'),
                    navLink('准备发送', 'encrypted'),
                ].join(' ')
                + '<br />'
                + content
            ,
            head
                : '<style type="text/css">'
                  + '.report{border: #CCCCCC 1px solid; width: 100%}'
                  + '.report td{border: #CCCCCC 0.5px solid;}'
                  + '.report .head{background: #CCCCCC;}'
                  + '.report .switch{font-weight: bold; text-align: center}'
                  + '.report .good{background: #00C000; color: #FFFFFF}'
                  + '.report .error{background: #BB0000; color: #FFFF00}'
                  + '.report .unknow{background: #FFDD00; color: #FF0000}'
                + '</style>'
            ,
        });
        rueckruf(null);
    };

    if($.types.isString(subcommand) && undefined != handlers[subcommand]){
        if('post' == e.method){
            e.on('ready', function(post){
                handlers[subcommand](
                    queues,
                    parameter,
                    action,
                    post,
                    respond
                );
            });
        } else
            handlers[subcommand](
                queues,
                parameter,
                action,
                null,
                respond
            );
    } else {
        index(respond);
    };
};
