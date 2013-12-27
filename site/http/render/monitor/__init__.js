var router = $.net.urlRouter();
module.exports = router;

router.proxy = function(template){
    return function(data){
        var childData = template(data);
        return {
            title: '系统状态监视器',
            content
                : '这里显示的是本系统各个部件的状态。'
                + '本监视器通过发起IPC（进程间通信）请求，检查本界面系统和各部件的通信是否畅通。'
                + childData 
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
        };
    };
};

router.handle('', require('./_.js')());
