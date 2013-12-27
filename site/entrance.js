module.exports = function(e){
    String('[' + e.protocol.toUpperCase() + ' SERVER] ' + e.method.toUpperCase() + ': ' + e.url.href).NOTICE();

    $.nodejs.async.waterfall(
        [
            require('./router.js')(e),
        ],
        function(err, result){
            if(null != err)
                if(302 == err){
                    e.response.writeHead(302, {
                        'Location': result
                    });
                    e.response.end();
                    return;
                } else if(418 == err){
                    // something that we would like to avoid.
                    if(null == result){
                        e.response.writeHead(404);
                        e.response.end();
                    } else {
                        e.response.writeHead(200, result.head);
                        e.response.end(result.data);
                    };
                } else
                    return outputError(e, 404);

            e.response.writeHead(200, {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache',
            });

            if(!$.types.isString(result)) result = JSON.stringify(result);
            e.response.end(result);
        }
    );
};
