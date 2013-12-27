var router = $.net.urlRouter();
module.exports = router;

function wrapTemplate(template){
    function navLink(text, target){
        if(true || subcommand == target)
            return '[<font color="#FF0000">' + text + '</font>]';
        else
            return '[<a href="/' + (new Date().getTime())
                + '/msgcenter/' + target + '">' + text + '</a>]'
            ;
    };
    return function(data){
        var childData = template(data);
        return {
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
                + childData 
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
                  + '.hint {color: #FF3030; text-decoration: italic}'
                + '</style>'
            ,
        };
    };
};

router
    .handle('', wrapTemplate(require('./_.js')))
;
