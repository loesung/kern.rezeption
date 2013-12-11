function queryState(rueckruf){
    var task = {};
    for(var item in IPC){
        task[item] = (function(ipcname){
            return function(callback){
                String('Querying for state of [' + ipcname + '].').DEBUG();
                IPC[ipcname].request(
                    '/',
                    function(err, packet){
                        callback(null, (null == err));
                    }
                );
            };
        })(item);
    };

    $.nodejs.async.parallel(
        task,
        function(err, result){
            if(null == err)
                rueckruf(result);
            else
                rueckruf(false);
        }
    );
};

module.exports = function(e, matchResult, rueckruf){
    function callback(states){
        var content = '';
        if(false == states){
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
                switch(states[list[each][0]]){
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

        outputPage(e, {
            title: '系统状态监视器',
            content
                : '这里显示的是本系统各个部件的状态。'
                + '本监视器通过发起IPC（进程间通信）请求，检查本界面系统和各部件的通信是否畅通。'
                + content
                + '<br />'
            ,
            head
                : '<style type="text/css">'
                  + '.report{border: #CCCCCC 1px solid; width: 100%; font-size: 9pt}'
                  + '.report td{border: #CCCCCC 0.5px solid;}'
                  + '.report .head{background: #CCCCCC;}'
                  + '.report .switch{font-weight: bold; text-align: center}'
                  + '.report .good{background: #00C000; color: #FFFFFF}'
                  + '.report .error{background: #BB0000; color: #FFFF00}'
                  + '.report .unknow{background: #FFDD00; color: #FF0000}'
                  + '.report button{text-align: center;}'
                + '</style>'
            ,
        });

        rueckruf(null);
    };

    queryState(callback);
};
