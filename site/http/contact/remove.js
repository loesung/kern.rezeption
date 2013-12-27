module.exports = function(identity, post, callback){
    var confirm = post.parsed.confirm,
        id = post.parsed.id;

    if(!($.types.isString(id) && $.types.isString(confirm)))
        return callback(true, '错误：错误的输入。');

    if(id.toLowerCase().substr(0, 16) != confirm.toLowerCase())
        return callback(true, '错误：未能确信您的删除意图。');

    identity.remove(id, function(err){
        if(null != err)
            callback(true, '错误：删除错误。可能是已经删除，或者数据中心无法连接。');
        else
            callback(true, '删除完成。请返回列表。');
    });
};
