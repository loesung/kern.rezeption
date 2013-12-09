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
function encryptAndDeleter(queues, ipc, msgid, type, opts){
    return function(callback){
        String('Encrypt a piece of plaintext, ' 
            + 'and delete the original if successfully encrypted.').DEBUG();

        var workflow = [];

        // try to submit encrypt request
        workflow.push(function(cb){
            ipc.request('/encrypt/' + type, function(err, packet){
                if(null != err || packet.response.statusCode != 200){
                    String(
                        'Encryption failed. '
                        + 'StatusCode: ' + packet.response.statusCode
                    ).DEBUG();

                    cb(true);
                    return;
                };
                packet.on('ready', function(data){
                    cb(null, data);
                });
            } ,opts);
        });

        // if obtained ciphertext, insert to queue `send.proceeded`.
        workflow.push(function(data, cb){
            queues.send.proceeded.push(data, function(err){
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

function akashicForm(ids, phase, action){
    /* Use between phases, to let the server program recall what to do. */
    var kvs = {
        'phase': phase + 1,
        'do': action,
    };
    for(var i in ids)
        kvs['item' + i] = ids[i];
    output = '';
    for(var key in kvs){
        output += 
            '<input type="hidden" name="'
            + key + '" value="' + kvs[key] + '" />'
        ;
    };
    return output;
};

/*
 * Encrypt using passphrase
 */
function passphrase(queues, ids, phase, post, respond){
    var output = '';
    if(0 == phase){
        output = '&gt;&gt; 即将使用临时口令加密 <font color="#FF0000">'
            + ids.length
            + '</font> 条密文。请确定用来保护信息的密码。'

            + '<form method="POST" action="/' + (new Date().getTime()) + '/msgcenter/plaintext/-/do">'
            + akashicForm(ids, phase, 'passphrase')
            + '<table cellspacing="1" cellpadding="0">'
            + '<tr><td colspan="2">'
            + '密码必须不少于于20个字符，并且由大写(A-Z)、小写(a-z)、数字(0-9)和特殊字符(键盘上可见符号)混杂而成。<br />'
            + '解密需要对方输入同样的密码。您可以给出密码提示，不超过140字符，只能由组成密码的可行字符和空格构成。'
            + '</td></tr>'
            + '<tr><td>请输入密码：</td><td><input name="password" type="password" size="40"/></td></tr>'
            + '<tr><td>请再输入一遍确认：</td><td><input name="password2" type="password" size="40"/></td></tr>'
            + '<tr><td>密码提示：</td>'
            + '<td><input name="hint" type="text" size="40"/></td></tr>'
            + '</table>'

            + '<table><tr>'
            + '<td><button type="submit" name="submit" value="encrypt" class="navbutton btn-normal">加密</button></td>'
            + '<td><button type="submit" name="submit" value="cancel" class="navbutton">取消</button></td>'
            + '</tr></table>'

            + '</form>'
        ;
        respond(null, output);
    } else {
        if('encrypt' != post.parsed.submit){
            respond(302, '/msgcenter/plaintext');
            return;
        };
        var workflow = [], password;

        // check password validity
        workflow.push(function(cb){
            password = new 
                $.nodejs.buffer.Buffer(post.parsed.password).toString('hex');
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
                    'key',
                    {post: post}
                ));
            };

            $.nodejs.async.parallel(task, function(err, result){
                cb(null);
            });
        });

        // carry out tasks!
        $.nodejs.async.waterfall(workflow, function(err, result){
            respond(null, 'I\'m working on this.');
        });

        // End of bulk encryption.
    }; 
};

/*
 * Remove selected messages
 */
function remove(queues, ids, phase, post, respond){
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
            respond(302, '/msgcenter/plaintext');
        });
    };

    if(0 == phase){
        output = '确定删除' + ids.length + '条待发消息？'
            + '<form method="POST" action="/' + (new Date().getTime()) + '/msgcenter/plaintext/-/do">'
            + akashicForm(ids, phase, 'remove')
            + '<table><tr><td><button type="submit" name="confirm" value="y">确定</button></td>'
            + '<td><button type="submit" name="confirm" value="n">取消</button></td></tr></table>'
            + '</form>'
        ;
        respond(null, output);
    } else {
        if('y' == post.parsed['confirm']){
            worker();
        } else {
            respond(302, '/msgcenter/plaintext');
        };
    };
};



/*
 * Logic to apply job
 */
module.exports = function(queues, parameter, post, respond, urlcommand){
    function backToIndex(){
        respond(302, '/msgcenter/plaintext');
    };
    var isID = /^[0-9a-f]{8}\-([0-9a-f]{4}\-){3}[0-9a-f]{12}$/i;
    var isPost = $.types.isObject(post);

    /* Determine objects being operated
     * - if by post, read posted body.
     * - read parameter
     * Anyway, use isID.test() to filter all id.
     */
    var objectIDs = [];
    if(isID.test(parameter)) objectIDs.push(parameter.toLowerCase());
    if(isPost){
        for(var key in post.parsed){
            if(isID.test(post.parsed[key]))
                objectIDs.push(post.parsed[key].toLowerCase());
        };
    };
    if(objectIDs.length < 1) return backToIndex();

    /* Determine action: send(codebook, ...), or remove */
    var action = urlcommand;
    if(isPost) action = post.parsed['do'];
    if(!/^(remove|passphrase|codebook|sign)$/i.test(action))
        return backToIndex();

    /* Determine phase of process */
    var phase = 0;
    if(isPost){
        if(!isNaN(post.parsed['phase']))
            phase = Math.round(post.parsed['phase']);
    };

    switch(action){
        case 'remove':
            remove(queues, objectIDs, phase, post, respond);
            break;
        case 'passphrase':
            passphrase(queues, objectIDs, phase, post, respond); 
            break;
        default:
            respond(null, 'not-implemented');
            break;
    };
};
