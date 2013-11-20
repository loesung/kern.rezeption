function queryState(rueckruf){
    $.nodejs.async.parallel(
        {
            'regtable': function(callback){
                IPC['regtable'].request(
                    '/',
                    function(err, packet){
                        callback(null, (null == err));
                    }
                );
            },
        },
        function(err, result){
            if(null == err)
                rueckruf(result);
            else
                rueckruf(false);
        }
    );
};

module.exports = function(e, matchResult){
    function callback(states){
        var content = '';
        if(false == states){
            content = '在查询中出现错误。';
        } else {
            var translation = {
                'regtable': '注册表管理器',
            };
            for(var each in states){
                content += translation[each]
                    + '当前状况'
                    + (states[each]? '良好': '错误')
                    + '<br />'
                ;
            };
        };

        outputPage(e, {
            title: '系统状态监视器',
            content
                : '从这里您可以看到系统的各种状态。' + content + '<br />'
            ,
        });
    };

    queryState(callback);
};
