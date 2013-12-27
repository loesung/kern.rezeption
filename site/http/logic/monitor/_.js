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

module.exports = function(){
    return function(data, callback){
        queryState(function(result){
            console.log('!!!', result);
            callback(null, result);
        });
    };
};
