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
        if(!/^(passphrase|codebook|sign)$/i.test(post.parsed.send)){
            callback(302, '/msgcenter/plaintext');
        } else {
            callback(
                302,
                '/msgcenter/plaintext/' + queueID + '/' + post.parsed.send
            );
        };
    });

    $.nodejs.async.waterfall(workflow, respond);
};
