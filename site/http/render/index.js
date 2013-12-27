function showReport(data){
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

    ret += add('系统信息', [
        ['中央处理器', data.cpu[0][0] + ' (' + data.cpu[0][1] + '个)'],
        ['操作系统', 
            [data.os.type, data.os.arch, data.os.release].join(', ')
            + ', 已运行'
            + _.format.seconds2Human(data.os.uptime())
        ],
        ['内存',
            '可用'
            + _.format.bytes2Human(data.memory.free)
            + ' / 总计' 
            + _.format.bytes2Human(data.memory.total)
        ],
    ]);

    ret += add('系统或所用库的版本', [
        ['v8',      data.version.v8,        'JavaScript引擎'],
        ['node',    data.version.node,      '用来运行本系统的程序'], 
        ['OpenSSL', data.version.openssl,   '提供密码服务'],
        ['zlib',    data.version.zlib,      '提供数据压缩服务'],
    ]);
    ret += '</table>';
    return ret;
};

module.exports = function(data){
    return {
        title: '主页',
        content
            : '欢迎使用。请使用左侧菜单选择功能。下面显示本系统的基本信息。'
            + showReport(data) 
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
    };
};
