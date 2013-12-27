module.exports = function(identity, callbackWrapper){
    return function(data, callback){
        $.nodejs.async.waterfall([
            function(callback){
                identity.add(post.parsed.name, callback);
            },

            function(json, callback){
                callback(null, json);
            },

        ], function(err, result){
            if(null == err){
                callback(true, '添加成功。');
                return;
            };

            if(true === err) {
                callback(true, '添加失败，名称不合适，或者该联系人已经存在。');
                return;
            };

            callback(true, '添加失败，错误代码为：' + err);
        });
    };
};
