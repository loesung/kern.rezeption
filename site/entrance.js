var emergency_button = function(width){
    if(undefined == width) width = 200;
    var height = 108 * width / 200;
    return '<a href="/stop"><img src="/static/stop.png" alt="紧急锁定按钮" width="' + width + '" height="' + height + '"></a>';
};

outputPage = function(e, data){
    var realPathname = /^(\/[0-9]+)?(.+)$/.exec(e.url.pathname)[2];

    function navigate_bar(){
        return '<tr><td class="navbar"></td></tr>';
    };
    function navigate_link(name, target){
        var ret = '<form action="/' + (new Date().getTime()) + target + '"><tr><td>';
        if(realPathname.substr(1, target.length-1) == target.substr(1))
            ret += ('<button class="navbutton btn-active" type="submit">' + name + '</button>');
        else
            ret += ('<button class="navbutton btn-normal" type="submit">' + name + '</button>');
        ret += "</td></tr></form>";
        return ret;
    };
    function section(name, content){
        return (
            '<div class="bar">' + name + '</div>'
            + '<div>' + content + '</div>'
        );
    };
    var menu
        = navigate_bar()
        + navigate_link('首页', '/home')
        + navigate_bar()
        + navigate_link('消息队列', '/msgcenter')
        + navigate_link('撰写信息', '/compose')
        + navigate_link('管理联系人和密钥', '/contact')
        + navigate_bar()
        + navigate_link('系统日志', '/log')
        + navigate_link('系统状态监视器', '/monitor')
        + navigate_link('密文信道监视器', '/tunnel')
    ;

    var sidebarWidth = 120;
    var uptime = _.format.seconds2Human($.process.uptime());
    var memoryUsage = _.format.bytes2Human($.process.memoryUsage().rss);

    var nowtime = new Date();
    var timeShow = _.format.time2Full(nowtime);

    var output    
        = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
        + '<html><head><meta http-equiv="Content-Type" content="application/html; charset=utf-8" />'
        + '<title>' + CONFIG.get('site-name') + ' | ' + data['title'] + '</title>'
        + ((undefined == data['head'])?'':data['head'])
        + '<style type="text/css">'
            + 'body{background: #FFFFFF;}'
            + 'a img{border: 0px}'
            + '.fullWidth{width: 99%;}'
            + '.navbutton {margin-bottom: 0px; padding: 0px; border: none; width: 100%; font-size: 9pt}'
            + '.btn-normal{background: #3333CC;color: #FFFFFF; text-decoration:none}'
            + '.btn-active{background: #DDDDFF;color: #000000; text-decoration:none;}'
            + '.navbar{padding-top: 3px;}'
            + 'input[type="hidden"]{display: none}'
            + '.leftLine{border-left:#CCCCCC 1px solid;}'
            + '.bottomLine{border-bottom:#CCCCCC 1px solid;}'
            + '.topLine{border-top:#CCCCCC 1px solid;}'
            + '.bar{font-weight: bold; background: #3333CC; color: #FFFFFF; padding: 5px;}'
            + '.fineLine{border: none; width: 100%}'
            + '.fineLine tr,td{border: none}'
            + '#hidden{display: none}'
        + '</style>'
        + '</head><body>'
        + '<div id="hidden">请打开本地CSS渲染。Dillo菜单的Tools-&gt;Use embedded CSS。</div>'
        + '<table class="fullWidth">'     
                        // No, no, I don't like it either. But this is the 
                        // very practical way to display on a damnly small
                        // browser like Dillo.
          + '<tr valign="top">'
            + '<td width="5%">'
              + '<img src="/static/logo.png" width="' + sidebarWidth + '" height="' + 106 * sidebarWidth / 160 + '">' 
              + '<table class="fineLine" cellspacing="0" cellpadding="0">' + menu + '</table>'
              + emergency_button(sidebarWidth) 
              + '</td>'
            + '<td class="leftLine">'
              + section('系统控制 ' + timeShow, 
                  '<table class="fullWidth">'
                + '<tr valign="bottom"><td>'
                + '服务器已运行' + uptime + '，进程占用内存' + memoryUsage
                + '</td>'
                + '<td width="20%" align="center">'
                +   '<form action="/' + (nowtime.getTime()) + realPathname + '">'
                +   '<button class="navbutton btn-active" type="submit">刷新页面</button>'
                +   "</form>"
                + '</tr>'
                +'</table>'
              )
              + section(('当前位置：' + data['title']), data['content'])
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



module.exports = function(e){
    String('[' + e.protocol.toUpperCase() + ' SERVER] ' + e.method.toUpperCase() + ': ' + e.url.href).NOTICE();

    $.nodejs.async.waterfall(
        [
            require('./router.js')(e),
        ],
        function(err, result){
            if(null != err)    
                outputError(e, 404);
        }
    );
};
