module.exports = function(){
    return function(data){
        var content = '';
        if(false == data){
            content = '在查询中出现错误。';
        } else {
            var list = [
                ['botschaft',       '<strong>通信系统</strong>',
                                                    '独立运行，连接和管理消息收发软硬件，负责收发密文。'],
                ['regtable',        '注册表管理器', '管理系统各部件配置参数的数据库，为系统部件提供数据。'],
                ['geheimdienst',    '加密服务',     '提供应用对称加密算法进行加密和解密的服务。'],
                ['datenbank',       '数据中心',     '提供对机要信息和系统配置的存储服务。'],
            ];

            content += '<table class="report" cellspacing="0px" cellpadding="1px">'
                + '<tr class="head">'
                  + '<td width="15%">项目</td>'
                  + '<td width="10%">操作</td>'
                  + '<td>解释</td>'
                + '</tr>'
            ;
            
            for(var each in list){
                var className = '', operation = '';
                switch(data[list[each][0]]){
                    case true:
                        className = 'good';
                        operation = '<button class="navbutton btn-normal" type="submit" name="action" value="stop">停止</button>';
                        break;
                    case false:
                        className = 'error';
                        operation = '<button class="navbutton btn-normal" type="submit" name="action" value="start">启动</button>';
                        break;
                    default:
                        className = 'unknow';
                        desc = '未知';
                        break;
                };

                content += '<tr>'
                content += '<td class="switch ' + className + '">' + list[each][1] + '</td>'
                    + '<td>' + operation + '</td>'
                    + '<td>' + list[each][2] + '</td>'
                ;
                content += '</tr>';
            };
            content += '</table>';
        };

        return content;
    };
};
