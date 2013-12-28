module.exports = function(identity){
    return function(data, callback){
        $.nodejs.async.waterfall([
            function(callback){
                identity.add(data.post.name, callback);
            },

            function(json, callback){
                callback(null, json);
            },

        ], function(err, result){
            if(null == err){
                callback(null, '添加成功。');
                return;
            };

            if(true === err) {
                callback(null, '添加失败，名称不合适，或者该联系人已经存在。');
                return;
            };

            if(401 == err)
                return callback(401, ('/contact/?_=' + process.hrtime()[1]));

            callback(null, '添加失败，错误代码为：' + err);
        });
    };
};
