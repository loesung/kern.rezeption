/*
 * Process plaintext messages
 *
 * There are 2 types of processing:
 *  1. Remove. This will lead to selected message(s) deleted.
 *  2. Encrypt. Selected messages will be encrypted, depending on desired
 *     methods, which the user will choose to encrypt given messages.
 *     After encryption, the user will be redirected(via a 302 redirection) to
 *     the sending page, just like after composing the user will be redirected
 *     to this page.
 */
function encryptAndDeleter(queues, ipc, msgid, comment, type, opts){
    return function(callback){
        String('Encrypt a piece of plaintext, ' 
            + 'and delete the original if successfully encrypted.').DEBUG();

        var workflow = [];

        // try to submit encrypt request
        workflow.push(function(cb){
            ipc.request('/encrypt/' + type, function(err, packet){
                if(null != err || packet.response.statusCode != 200){
                    String('Encryption failed. ').DEBUG();

                    cb(true);
                    return;
                };
                packet.on('ready', function(data){
                    cb(null, data);
                });
            }, opts);
        });

        // if obtained ciphertext, insert to queue `send.proceeded`.
        workflow.push(function(data, cb){
            try{
                var ciphertext = 
                    new $.nodejs.buffer.Buffer(data.raw, 'hex').toString();
            } catch(e){
                return cb(true);
            };
            if(ciphertext.length <= 0) return cb(true);

            queues.send.proceeded.push(ciphertext, comment, function(err){
                cb(err);
            });
        });

        // then delete orginal from queue
        workflow.push(function(cb){
            queues.send.pending.remove(msgid);
            cb(null);
        });

        $.nodejs.async.waterfall(workflow, callback);
    };
};

function doneAndRedirectToSend(ids, respond){
    "Done encrypting and redirecting to send page.".DEBUG();
    respond(302, '/msgcenter/encrypted/' + ids.join('.') + '/send');
};

/*
 * Encrypt using passphrase
 */
function passphrase(queues, ids, phase, data, respond){
    if(0 == phase){
        respond(null, {
            type: 'passphrase',
            phase: phase,
            ids: ids,
        });
    } else {
        if('encrypt' != data.post.submit){
            respond(302, '/msgcenter/plaintext/?_=' + process.hrtime()[1]);
            return;
        };
        var workflow = [], password;

        // check password validity
        workflow.push(function(cb){
            password = new 
                $.nodejs.buffer.Buffer(data.post.password).toString('hex');
            cb(null);
        });
        
        // retrive message body
        workflow.push(function(cb){
            var task = {};
            for(var i in ids){
                task[ids[i]] = (function(){
                    var itemID = ids[i];
                    return function(callback){
                        queues.send.pending.query(itemID, callback);
                    };
                })();
            };
            $.nodejs.async.parallel(task, cb);
        });

        // deploy tasks
        workflow.push(function(result, cb){
            var task = [], post;
            for(var id in result){
                // configure encryption options
                post = $.nodejs.querystring.stringify({
                    key: password,
                    plaintext:
                        new $.nodejs.buffer.Buffer(
                            result[id].data
                        ).toString('hex')
                });

                // Add a task of encrypt and delete a plaintext.
                task.push(encryptAndDeleter(
                    queues,
                    IPC['geheimdienst'],
                    id,
                    result[id].comment,
                    'key',
                    {post: post}
                ));
            };

            $.nodejs.async.parallel(task, function(err, result){
                cb(null);
            });
        });

        // carry out tasks!
        $.nodejs.async.waterfall(workflow, function(err){
            doneAndRedirectToSend(ids, respond);
        });

        // End of bulk encryption.
    }; 
};

/*
 * Remove selected messages
 */
function remove(queues, ids, phase, data, respond){
    var output = '';

    function worker(){
        var task = [];
        for(var i in ids){
            task.push((function(){
                var itemID = ids[i];
                return function(callback){
                    queues.send.pending.remove(itemID, function(){
                        callback(null);
                    });
                };
            })());
        };
        $.nodejs.async.parallel(task, function(err){
            respond(302, '/msgcenter/plaintext/?_=' + process.hrtime()[1]);
        });
    };

    if(0 == phase){
        respond(null, {
            type: 'remove',
            ids: ids,
            phase: phase,
        });
    } else {
        if('y' == data.post['confirm']){
            worker();
        } else {
            respond(302, '/msgcenter/plaintext/?_=' + process.hrtime()[1]);
        };
    };
};



/*
 * Logic to apply job
 */
module.exports = function(queues){
    return function(data, callback){
        function backToIndex(){
            callback(302, '/msgcenter/plaintext/?_=' + process.hrtime()[1]);
        };
        var isID = /^[0-9a-f]{8}\-([0-9a-f]{4}\-){3}[0-9a-f]{12}$/i;

        /* Determine objects being operated
         * - if by post, read posted body.
         * - read parameter
         * Anyway, use isID.test() to filter all id.
         */
        var objectIDs = [];
        for(var key in data.get){
            if(isID.test(data.get[key]))
                objectIDs.push(data.get[key].toLowerCase());
        };
        for(var key in data.post){
            if(isID.test(data.post[key]))
                objectIDs.push(data.post[key].toLowerCase());
        };
        if(objectIDs.length < 1) return backToIndex();

        /* Determine action: send(codebook, ...), or remove */
        var action = data.get['do'];
        if(undefined != data.post['do']) action = data.post['do'];
        if(!/^(remove|passphrase|codebook|sign)$/i.test(action))
            return backToIndex();

        /* Determine phase of process */
        var phase = 0;
        if(!isNaN(data.post['phase']))
            phase = Math.round(data.post['phase']);

        switch(action){
            case 'remove':
                remove(queues, objectIDs, phase, data, callback);
                break;
            case 'passphrase':
                passphrase(queues, objectIDs, phase, data, callback); 
                break;
            default:
                backToIndex();
                break;
        };
    };
};
