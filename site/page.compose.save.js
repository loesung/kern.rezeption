module.exports = function(queues, post, respond){
    console.log(post);
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

        var queueID = json.id;
        delete json;

        $.global.set('compose', '');
        callback(null, queueID);
    });

    workflow.push(function(queueID, callback){
        switch(post.parsed.send){
            case 'passphrase':
                break;
            case '':
                break;
            default:
                break;
        };
    });

    $.nodejs.async.waterfall(workflow, respond);
};
