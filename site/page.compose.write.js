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
        + '<select name="send">'
        +   '<option value="no">-- 不发送，仅保存到队列，可稍后选择加密方式再发送 --</option>'
        +   '<option value="passphrase" selected>加密，使用临时输入的口令</option>'
        +   '<option value="codebook">加密，指定一个或多个收件人，使用密码本</option>'
        +   '<option value="sign">使用公钥签署，但不加密</option>'
        + '</select>'
        + '<br /><button type="submit">发送</button>'
        + '</form>'
    ));
};
