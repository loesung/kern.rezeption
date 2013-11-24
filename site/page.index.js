module.exports = function(e, matchResult, rueckruf){
    outputPage(e, {
        title: '主页',
        content
            : '欢迎使用。当前系统有N条新信息。'
        ,
    });

    rueckruf(null);
};
