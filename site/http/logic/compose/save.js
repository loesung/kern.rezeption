module.exports = function(queues){
    return function(data, callback){
        $.global.set('compose', data.post.content);

        var workflow = [];

        workflow.push(function(callback){
            String('Command on pushing a new message to queue.').DEBUG();
            queues.send.pending.push(
                data.post.content,
                data.post.comment,
                function(err, json){
                    if(null != err) 
                        return callback(
                            true, Error('错误：没能将消息插入发送队列。')
                        );
                    callback(null, json);
                }
            );
        });

        workflow.push(function(json, callback){
            if(!$.types.isObject(json)){
                String('Expected queue add result failed.').DEBUG();
                String('Unable to insert new message into send.pending queue.')
                    .ERROR()
                ;
                callback(true, Error('错误：没能将消息插入发送队列。'));
                return;
            };

            String('New message inserted into send.pending queue.').DEBUG();
            var queueID = json.id;
            delete json;

            $.global.set('compose', '');
            callback(null, queueID);
        });

        workflow.push(function(queueID, callback){
            if(!/^(passphrase|codebook|sign)$/i.test(data.post.send)){
                callback(302, '/msgcenter/plaintext/');
            } else {
                callback(
                    302,
                    '/msgcenter/plaintext/process?item0='
                    + queueID
                    + '&do='
                    + data.post.send
                );
            };
        });

        $.nodejs.async.waterfall(workflow, function(err, result){
            callback(err, result);
            console.log(err, result);
        });
    };
};
