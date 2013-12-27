var contentType = function(filename){
    var l = filename.substr(-3);
    var table = {
        'png': 'image/png',
    };
    if(undefined == table[l]) 
        return 'text/html';
    else
        return table[l];
};

module.exports = function(){
    return function(data, callback){
        var tester = /^[0-9a-zA-Z\.\-]+$/;
        if(!tester.test(data.get.name)){
            outputError(e, 404);
            return;
        };
        
        var stuff = $.nodejs.fs.readFile(
            $.process.resolvePath('./site/http/static/' + data.get.name),
            function(err, fileData){
                if(err){
                    console.log(err);
                    callback(418, null);
                } else {
                    callback(
                        418,
                        {
                            head: {
                                'Content-Type': contentType(data.get.name),
                            },
                            data: fileData
                        }
                    );
                };
            }
        );
    };
};
