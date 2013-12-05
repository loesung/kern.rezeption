module.exports = function(callback){
    var saved = $.global.get('compose');
    if(null != saved){
        saved = saved.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } else
        saved = '';
    callback(null, (''
        + '<form action="/' + String(new Date().getTime()) + '/compose" method="POST">'
        + '请在下面的文本框中编辑您的消息。您可以使用Ctrl+C和Ctrl+V复制粘贴。<br />'
        + '在任何时候，提交的数据都会被保存到发送队列。但是只有您确定了加密方式，才能发送。<br />'
        + '<strong>如果保存到发送队列失败，在您返回这个页面时仍会显示上一次编辑的消息。</strong>'
        + '<br />'
        + '<textarea cols="70" rows="8" name="content">' + saved + '</textarea>'
        + '<br />发送方式：'
        + '<table width="100%"><tr>'
        + '<td><button type="submit" name="send" value="no">保存草稿</button></td>'
        + '<td><button type="submit" name="send" value="passphrase">使用临时口令加密发送</button></td>'
        + '<td><button type="submit" name="send" value="codebook">使用密码本加密发送</button></td>'
        + '<td><button type="submit" name="send" value="sign">使用公钥签署，不加密发送</button></td>'
        + '</tr></table>'
        + '</form>'
    ));
};
