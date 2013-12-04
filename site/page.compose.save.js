module.exports = function(queues, post, respond){
    $.global.set('compose', post.parsed.content);

    var workflow = [];

    workflow.push(function(callback){
        queues.send.pending.push(post.parsed.content, callback);
    });

    workflow.push(function(json, callback){
        if(!$.types.isObject(json)){
            callback(true, '错误：没能将消息插入发送队列。');
            return;
        };

        var id = json.id;
        $.global.set('compose', '');
        callback(null, ('saved:' + id));
    });

    $.nodejs.async.waterfall(workflow, respond);
};
