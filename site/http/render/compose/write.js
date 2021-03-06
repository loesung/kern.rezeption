module.exports = function(){
    return function(data){
        if(null != data){
            data = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        } else
            data = '';

        return (''
            + '<form action="/compose/save?_=' + process.hrtime()[1] + '" method="POST">'
            + '请在下面的文本框中编辑您的消息。您可以使用Ctrl+C和Ctrl+V复制粘贴。<br />'
            + '在任何时候，提交的数据都会被保存到发送队列。但是只有您确定了加密方式，才能发送。<br />'
            + '<strong>如果保存到发送队列失败，在您返回这个页面时仍会显示上一次编辑的消息。</strong>'
            + '<br />'
            + '<textarea cols="70" rows="5" name="content">' + data + '</textarea>'
            + '<br />建议您附注一段用于标记这份消息的注释，以便管理，它将不会被发送（200字以内）：'
            + '<input name="comment" size="70" maxlength="200"/>'
            + '<br />发送方式：'
            + '<table width="100%"><tr>'
            + '<td><button type="submit" name="send" value="no">保存草稿</button></td>'
            + '<td><button type="submit" name="send" value="passphrase">使用临时口令加密发送</button></td>'
            + '<td><button type="submit" name="send" value="codebook">使用密码本加密发送</button></td>'
            + '<td><button type="submit" name="send" value="sign">使用公钥签署，不加密发送</button></td>'
            + '</tr></table>'
            + '</form>'
        );
    };
};
