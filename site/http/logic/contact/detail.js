module.exports = function(identity){
    return function(data, callback){
        var identityInfo = null,
            codebookInfo = null;

        String("Query identity details for user: " + data.get.id).DEBUG();

        $.nodejs.async.waterfall([
            function(callback){
                identity.query(data.get.id, callback);
            },

            function(json, callback){
                if(null == json){
                    callback(true);
                } else {
                    identityInfo = json;
                    callback(null);
                };
            },

            function(callback){
                // TODO check for codebooks
                callback(null);
            },

        ], function(err, result){
            if(401 == err)
                return callback(401, '/contact/detail?'
                    + $.nodejs.querystring.stringify({
                        id: data.get.id,
                        _: process.hrtime()[1],
                    })
                );

            if(null != err){
                return callback(null, {
                    error: '错误：找不到联系人。可能已经被删除。'
                });
            };

            callback(null, {
                identity: {
                    name: identityInfo.name,
                    id: identityInfo.id,
                }
            });
        });
    };
};

