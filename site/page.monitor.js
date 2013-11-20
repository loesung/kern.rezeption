function queryState(callback){
    
};

module.exports = function(e, matchResult){
    function callback(states){
        outputPage(e, {
            title: '系统状态监视器',
            content
                : '从这里您可以看到系统的各种状态。<br />'
            ,
        });
    };

    queryState(callback);
};
