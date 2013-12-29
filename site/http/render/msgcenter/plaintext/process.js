module.exports = function(akashicForm){
    return function(data){
        var ret = '' ;

        if('remove' == data.type){
            ret = '确定删除' + data.ids.length + '条待加密的消息？'
                + '<form method="POST" action="/msgcenter/plaintext/process?_=' + (new Date().getTime()) + '">'
                + akashicForm(data.ids, data.phase, 'remove')
                + '<table><tr><td><button type="submit" name="confirm" value="y">确定</button></td>'
                + '<td><button type="submit" name="confirm" value="n">取消</button></td></tr></table>'
                + '</form>'
            ;
        };

        if('passphrase' == data.type){
            ret = '&gt;&gt; 即将使用临时口令加密 <font color="#FF0000">'
                + ids.length
                + '</font> 条密文。请确定用来保护信息的密码。'

                + '<form method="POST" action="/msgcenter/plaintext/process">'
                + akashicForm(ids, phase, 'passphrase')
                + '<table cellspacing="1" cellpadding="0">'
                + '<tr><td colspan="2">'
                + '密码必须不少于于20个字符，并且由大写(A-Z)、小写(a-z)、数字(0-9)和特殊字符(键盘上可见符号)混杂而成。<br />'
                + '解密需要对方输入同样的密码。您可以给出密码提示，不超过140字符，只能由组成密码的可行字符和空格构成。'
                + '</td></tr>'
                + '<tr><td>请输入密码：</td><td><input name="password" type="password" size="40"/></td></tr>'
                + '<tr><td>请再输入一遍确认：</td><td><input name="password2" type="password" size="40"/></td></tr>'
                + '<tr><td>密码提示：</td>'
                + '<td><input name="hint" type="text" size="40"/></td></tr>'
                + '</table>'

                + '<table><tr>'
                + '<td><button type="submit" name="submit" value="encrypt" class="navbutton btn-normal">加密</button></td>'
                + '<td><button type="submit" name="submit" value="cancel" class="navbutton">取消</button></td>'
                + '</tr></table>'

                + '</form>'
            ;
        };

        return ret;
    };
};
