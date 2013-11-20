var navigate_bar = function(){
    return '<div class="navbar"></div>';
};

var emergency_button = function(){
    return '<a href="/stop"><img src="/static/stop.png" alt="紧急锁定按钮" width="200" height="108"></a>';
};

outputPage = function(e, data){
    var navigate_link = function(name, target){
        if(e.url.pathname == target)
            return '<div class="navbutton btn-active">' + name + '</div>';
        else
            return '<div class="navbutton btn-normal"><a href="' + target + '?_' + (new Date().getTime()) + '" target="_blank">' + name + '</a></div>';
    };
    var menu
        = navigate_bar()
        + navigate_link('首页', '/')
        + navigate_bar()
        + navigate_link('收到的消息', '/msgcenter')
        + navigate_link('撰写信息', '/send')
        + navigate_link('管理联系人', '/contact')
        + navigate_link('管理对称密钥', '/key')
        + navigate_bar()
        + navigate_link('系统日志', '/log')
        + navigate_link('系统状态监视器', '/monitor')

    ;

    var output    
        = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
        + '<html><head><meta http-equiv="Content-Type" content="application/html; charset=utf-8" />'
        + '<title>' + CONFIG.get('site-name') + ' | ' + data['title'] + '</title>'
        + ((undefined == data['head'])?'':data['head'])
        + '<style type="text/css">'
            + 'body{background: #FFFFFF;}'
            + '.fullWidth{width: 99%;}'
            + '.btn-active{background: #DDDDFF; border: #BBBBCC 2px solid}'
            + '.btn-normal{background: #3333CC;}'
            + '.navbutton {margin: 2px; padding: 5px;}'
            + '.btn-normal a{color: #FFFFFF; text-decoration:none}'
            + '.btn-active a{color: #000000; text-decoration:none; font-weight: bold}'
            + '.navbar{padding-top: 7px;}'
            + '.rightLine{border-left:#CCCCCC 1px solid;}'
            + '.bottomLine{border-bottom:#CCCCCC 1px solid;}'
            + '.topLine{border-top:#CCCCCC 1px solid;}'
            + '#hidden{display: none}'
        + '</style>'
        + '</head><body>'
        + '<div id="hidden">请打开本地CSS渲染。Dillo菜单的Tools-&gt;Use embedded CSS。</div>'
        + '<table class="fullWidth">'     
                        // No, no, I don't like it either. But this is the 
                        // very practical way to display on a damnly small
                        // browser like Dillo.
          + '<tr valign="top">'
            + '<td width="15%">'
              + '<img src="/static/logo.png" width="200" height="133">' 
              + menu 
//              + emergency_button() 
              + '</td>'
            + '<td class="rightLine">'
              +'<table class="fullWidth">'
                + '<tr valign="bottom"><td>'
                  + '<strong>请务必启用图片！否则您可能看不到紧急按钮！</strong><br />'
                  + '<a href="' + e.url.pathname + '?_=' + (new Date().getTime()) + '">刷新页面</a>'
                + '</td>'
                + '<td width="20%" align="right">' + emergency_button() + '</td>'
                + '</tr><tr><td colspan="2" class="topLine">'
                  + data['content']
                + '</td></tr>'
              +'</table>'
            + '</td>'
          + '</tr>'
        + '</table>'
        + '</body></html>'
    ;
    e.response.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
    });
    e.response.end(output);
};

var routerTable = {
    '^\/(\\?.+)?$': require('./page.index.js'),
    '^\/monitor\/?(\\?.+)?$': require('./page.monitor.js'),

    '^\/static\/([0-9a-zA-Z\.\-]+)$': require('./page.static.js'),
};

module.exports = function(e){
    console.log(e.request.url);

    var handled = false;
    for(var expression in routerTable){
        var regexp = new RegExp(expression);
        var result = regexp.exec(e.request.url);
        if(null != result){
            routerTable[expression](e, result);
            handled = true;
            break;
        };
    };

    if(!handled){
        outputError(e, 404);
    };
};
