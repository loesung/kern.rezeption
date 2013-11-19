var navigate_link = function(name, target){
    return '<div class="navbutton"><a href="' + target + '" target="_blank">' + name + '</a></div>';
};
var navigate_bar = function(){
    return '<div class="navbar"></div>';
};

outputPage = function(e, data){
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
        + '<html><head><meta http-equiv="Content-Type" content="application/html; charset=utf-8" /><title>'
        + data['title'] + '</title>'
        + ((undefined == data['head'])?'':data['head'])
        + '<style type="text/css">'
            + 'body{background: #FFFFFF;}'
            + 'table{width: 98%;}'
            + '.navbutton{margin: 2px; padding: 5px; color: #FFFFFF; background: #6666CC;}'
            + '.navbutton a,a:visited,a:link,a:hover,a:active{color: #FFFFFF; text-decoration:none}'
            + '.navbar{padding-top: 7px;}'
            + '#hidden{display: none}'
        + '</style>'
        + '</head><body>'
        + '<div id="hidden">请打开本地CSS渲染。Dillo菜单的Tools-&gt;Use embedded CSS。</div>'
        + '<table>'     // No, no, I don't like it either. But this is the 
                        // very practical way to display on a damnly small
                        // browser like Dillo.
          + '<tr>'
            + '<td width="15%"><img src="/static/logo.png" width="200" height="133">' + menu + '</td>'
            + '<td>' + data['content'] + '</td>'
          + '</tr>'
        + '</table>'
        + '</body></html>'
    ;
    e.response.writeHead(200, {
        'Content-Type': 'text/html',
    });
    e.response.end(output);
};

var routerTable = {
    '^\/$': require('./page.index.js'),
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
