module.exports = function(data){    
    var ret = '<table width="100%" cellpadding="15" cellspacing="0"><tr><td>'
        + '已经连接到加密核心...'
        + '<h3>请提供密码，以便向<font color="#FF0000">加密核心</font>认证。</h3>'
        + '</td></tr><tr><td>'
        + '<form method="POST" action="/authenticate?' + $.nodejs.querystring.stringify({redirect: data.redirect}) + '">'
            + '<table><tr>'
                + '<td>请输入您的密码：</td>'
                + '<td><input name="password" size="30" type="password" /></td>'
                + '<td><button type="submit" class="navbutton btn-normal">认证</button></td>'
            + '</tr></table>'
        + '</form>'
        + '</td></tr><tr><td>'
        + '<strong>注意：</strong><br>'
        + '1. 认证后将缓存您的访问密码。<strong>如果您离开本机，请切记注销登录！</strong><br />'
        + '2. 如果您多次认证后仍然见到此界面，请检查密码。<br />'
        + '3. 首次连接到加密核心时所用的密码为初始密码。'
        + '</td></tr></table>'

    ;
    return {
        title: '需要认证',
        content: ret,
    };
};
