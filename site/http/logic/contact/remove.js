module.exports = function(identity){
    return function(data, callback){
        var confirm = data.post.confirm,
            id = data.post.id;

        if(!($.types.isString(id) && $.types.isString(confirm)))
            return callback(null, '错误：错误的输入。');

        if(id.toLowerCase().substr(0, 16) != confirm.toLowerCase())
            return callback(null, '错误：未能确信您的删除意图。');

        identity.remove(id, function(err){
            // TODO redirect to detail page.
            if(401 == err)
                return callback(401, '/contact/detail?'
                    + $.nodejs.querystring.stringify({
                        id: id,
                        _: process.hrtime()[1],
                    })
                );

            if(null != err)
                return callback(
                    null,
                    '错误：删除错误。可能是已经删除，或者数据中心无法连接。'
                );
            
            callback(null, '删除完成。请返回列表。');
        });
    };
};
