module.exports = function(e){
    String('[' + e.protocol.toUpperCase() + ' SERVER] ' + e.method.toUpperCase() + ': ' + e.url.href).NOTICE();

    $.nodejs.async.waterfall(
        [
            require('./router.js')(e),
        ],
        function(err, result){
            if(null != err) return outputError(e, 404);

            e.response.writeHead(200, {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache',
            });
            e.response.end(result);
        }
    );
};
