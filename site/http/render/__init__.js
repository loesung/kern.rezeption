function wrapTemplate(template){
    function emergencyButton(width){
        if(undefined == width) width = 200;
        var height = 108 * width / 200;
        return '<a href="/stop"><img src="/static/stop.png" alt="紧急锁定按钮" width="' + width + '" height="' + height + '"></a>';
    };
    
    function navigateBar(){
        return '<tr><td colspan="2" class="navbar"></td></tr>';
    };
    
    function navigateLink(name, target, realPathname){
        var ret = '<form method="GET" action="' + target + '"><tr><td colspan="2">';
        ret += '<input type="hidden" name="_" value="' + process.hrtime()[1] + '"/>';
        if(realPathname.substr(1, target.length-1) == target.substr(1))
            ret += ('<button class="navbutton btn-active" type="submit">' + name + '</button>');
        else
            ret += ('<button class="navbutton btn-normal" type="submit">' + name + '</button>');
        ret += "</td></tr></form>";
        return ret;
    };

    function navigateWriteSection(realPathname){
        var class1 = ((realPathname.substr(1, 9) == 'msgcenter')?'btn-active':'btn-normal'),
            class2 = ((realPathname.substr(1, 7) == 'compose')?'btn-active':'btn-special');
        return '<tr><form action="/msgcenter">'
            + '<input type="hidden" name="_" value="' + process.hrtime()[1] + '"/>'
            + '<td><button class="navbutton ' + class1 + '" type="submit">消息队列</button></td></form>'
            + '<form action="/compose"><td>'
            + '<input type="hidden" name="_" value="' + process.hrtime()[1] + '"/>'
            + '<button class="navbutton ' + class2 + '" type="submit">撰写</button></td></form></tr>'
        ;
    };

    function section(name, content){
        return (
            '<div class="bar">' + name + '</div>'
            + '<div>' + content + '</div>'
        );
    };

    return function(data){ // wrapped template
        var childData = template(data);

        var realPathname = '';///^(\/[0-9]+)?(.+)$/.exec(e.url.pathname)[2];

        var menu
            = navigateBar()
            + navigateLink('首页', '/', realPathname)
            + navigateBar()
            + navigateWriteSection(realPathname)
            + navigateLink('管理联系人和密钥', '/contact/', realPathname)
            + navigateBar()
            + navigateLink('系统日志', '/log', realPathname)
            + navigateLink('系统状态监视器', '/monitor', realPathname)
            + navigateLink('密文信道监视器', '/tunnel', realPathname)
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
            + ((undefined == childData['head'])?'':childData['head'])
            + '<style type="text/css">'
                + 'body{background: #FFFFFF;}'
                + 'a img{border: 0px}'
                + '.fullWidth{width: 99%;}'
                + '.navbutton {margin-bottom: 0px; padding: 0px; border: none; width: 100%; font-size: 9pt}'
                + '.btn-normal{background: #3333CC;color: #FFFFFF; text-decoration:none}'
                + '.btn-special{background: #00AA00;color: #FFFFFF; text-decoration:none;}'
                + '.btn-active{background: #DDDDFF;color: #000000; text-decoration:none; font-weight:bold}'
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
                  + emergencyButton(sidebarWidth) 
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
                  + section(('当前位置：' + childData['title']), childData['content'])
                + '</td>'
              + '</tr>'
            + '</table>'
            + '</body></html>'
        ;

        return output;
    };
};

var router = $.net.urlRouter();
router
    .handle('', wrapTemplate(require('./index.js')))
;

module.exports = function(version){
    return router;
};
