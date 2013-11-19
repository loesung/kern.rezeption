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

module.exports = function(e, result){
    var tester = /^[0-9a-zA-Z\.\-]+$/;
    if(!tester.test(result[1])){
        outputError(e, 404);
        return;
    };
    
    var stuff = $.nodejs.fs.readFile(
        'static/' + result[1],
        function(err, data){
            if(err){
                console.log(err);
                outputError(e, 404);
            } else {
                e.response.writeHeader(200, {
                    'Content-Type': contentType(result[1]),
                });
                e.response.end(data);
            };
        }
    );
};
