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
                ['regtable',        '注册表管理器', '管理系统各部件配置参数的数据库，为系统部件提供数据。'],
                ['geheimdienst',    '加密服务',     '提供应用对称加密算法进行加密和解密的服务。'],
                ['datenbank',       '数据中心',     '提供对机要信息和系统配置的存储服务。'],
            ];

            content += '<table class="report" cellspacing="0px" cellpadding="3px">'
                + '<tr class="head">'
                  + '<td width="20%">项目</td>'
                  + '<td width="15%">状态</td>'
                  + '<td>解释</td>'
                + '</tr>'
            ;
            function showState(what){
                var className = '', desc = '';
                switch(what){
                    case true:
                        className = 'good';
                        desc = '正常运行';
                        break;
                    case false:
                        className = 'error';
                        desc = '无法连通';
                        break;
                    default:
                        className = 'unknow';
                        desc = '未知';
                        break;
                };
                return '<td class="switch ' + className + '">' + desc + '</td>';
            };
            for(var each in list){
                content += '<tr>'
                content += '<td>' + list[each][1] + '</td>'
                    + showState(states[list[each][0]])
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

    queryState(callback);
};
