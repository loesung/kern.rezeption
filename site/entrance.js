var navigate_bar = function(){
    return '<div class="navbar"></div>';
};

var emergency_button = function(width){
    if(undefined == width) width = 200;
    var height = 108 * width / 200;
    return '<a href="/stop"><img src="/static/stop.png" alt="紧急锁定按钮" width="' + width + '" height="' + height + '"></a>';
};

outputPage = function(e, data){
    var realPathname = /^(\/[0-9]+)?(.+)$/.exec(e.url.pathname)[2];
    console.log(realPathname);

    function navigate_link(name, target){
        var ret = '<form action="/' + (new Date().getTime()) + target + '">';
        if(realPathname == target)
            ret += ('<button class="navbutton btn-active" type="submit">' + name + '</button>');
        else
            ret += ('<button class="navbutton btn-normal" type="submit">' + name + '</button>');
        ret += "</form>";
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

    var sidebarWidth = 120;

    var output    
        = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
        + '<html><head><meta http-equiv="Content-Type" content="application/html; charset=utf-8" />'
        + '<title>' + CONFIG.get('site-name') + ' | ' + data['title'] + '</title>'
        + ((undefined == data['head'])?'':data['head'])
        + '<style type="text/css">'
            + 'body{background: #FFFFFF;}'
            + 'a img{border: 0px}'
            + '.fullWidth{width: 99%;}'
            + '.navbutton {margin-bottom: 0px; padding: 0px; border: none; width: 100%}'
            + '.btn-normal{background: #3333CC;color: #FFFFFF; text-decoration:none}'
            + '.btn-active{background: #DDDDFF;color: #000000; text-decoration:none;}'
            + '.navbar{padding-top: 1px;}'
            + 'input[type="hidden"]{display: none}'
            + '.leftLine{border-left:#CCCCCC 1px solid;}'
            + '.bottomLine{border-bottom:#CCCCCC 1px solid;}'
            + '.topLine{border-top:#CCCCCC 1px solid;}'
            + '.bar{font-weight: bold; background: #3333CC; color: #FFFFFF; padding: 5px;}'
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
              + menu 
              + emergency_button(sidebarWidth) 
              + '</td>'
            + '<td class="leftLine">'
              + section('系统控制', 
                  '<table class="fullWidth">'
                + '<tr valign="bottom"><td>'
                + '<strong>请务必启用图片！否则您可能看不到紧急按钮！</strong><br />'
                + '页面产生于: ' + new Date() + ' <a href="/' + (new Date().getTime()) + realPathname + '">刷新页面</a>'
                + '</td>'
                + '<td width="20%" align="right"></td>'// + emergency_button() + '</td>'
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
