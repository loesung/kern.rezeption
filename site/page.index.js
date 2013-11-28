function selfReportSync(){
    function add(title, rows){
        var ret = '<tr class="head"><td colspan="3">' + title + '</td></tr>'
        for(var i in rows){
            var row = rows[i];
            ret += '<tr>';
            ret += '<td width="25%">' + row[0] + '</td>';
            if(undefined == row[2]){
                ret += '<td colspan="2">' + row[1] + '</td>';
            } else {
                ret += '<td>' + row[1] + '</td>';
                ret += '<td>' + row[2] + '</td>';
            };
            ret += '</tr>';
        };
        return ret;
    };
    var ret = '<table class="report" cellspacing="0px" cellpadding="1px">';

    var cpuInfo = $.nodejs.os.cpus();
    var cpuCounter = {};
    var cpuOutput = [];
    for(var i in cpuInfo){
        if(undefined == cpuCounter[cpuInfo[i].model])
            cpuCounter[cpuInfo[i].model] = 1;
        else
            cpuCounter[cpuInfo[i].model] += 1;
    };
    for(var i in cpuCounter){
        cpuOutput.push(i + ' (' + cpuCounter[i] + '个' + ')');
    };

    ret += add('系统信息', [
        ['中央处理器', cpuOutput.join('<br />')],
        ['操作系统', 
            $.nodejs.os.type() 
            + ', ' 
            + process.arch
            + ', '
            + $.nodejs.os.release()
            + ', 已运行'
            + _.format.seconds2Human($.nodejs.os.uptime())
        ],
        ['内存',
            '可用'
            + _.format.bytes2Human($.nodejs.os.freemem())
            + ' / 总计' 
            + _.format.bytes2Human($.nodejs.os.totalmem())
        ],
    ]);

    ret += add('系统或所用库的版本', [
        ['v8',      process.versions.v8,        'JavaScript引擎'],
        ['node',    process.versions.node,      '用来运行本系统的程序'], 
        ['openssl', process.versions.openssl,   '提供密码服务'],
        ['zlib',    process.versions.zlib,      '提供数据压缩服务'],
    ]);
    ret += '</table>';
    return ret;
};

module.exports = function(e, matchResult, rueckruf){
    outputPage(e, {
        title: '主页',
        content
            : '欢迎使用。请使用左侧菜单选择功能。下面显示本系统的基本信息。'
            + selfReportSync()
        ,
        head
            : '<style type="text/css">'
              + '.report{border: #CCCCCC 1px solid; width: 100%}'
              + '.report td{border: #CCCCCC 0.5px solid;}'
              + '.report .head{background: #CCCCCC;}'
              + '.report .switch{font-weight: bold; text-align: center}'
              + '.report .good{background: #00C000; color: #FFFFFF}'
              + '.report .error{background: #BB0000; color: #FFFF00}'
              + '.report .unknow{background: #FFDD00; color: #FF0000}'
            + '</style>'
        ,
    });

    rueckruf(null);
};
