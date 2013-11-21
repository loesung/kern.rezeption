module.exports = function(e, matchResult){
    function callback(){
        outputPage(e, {
            title: '系统日志',
            content
                : '系统日志<br />'
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
    };
    callback();
};
