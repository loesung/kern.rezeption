/*
 * Process encrypted messages
 *
 * There are 2 types of processing:
 *  1. Remove. This will lead to selected message(s) deleted.
 *  2. Send.
 */

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
                    queues.send.proceeded.remove(itemID, function(){
                        callback(null);
                    });
                };
            })());
        };
        $.nodejs.async.parallel(task, function(err){
            respond(302, '/msgcenter/encrypted');
        });
    };

    if(0 == phase){
        output = '确定删除' + ids.length + '条待发送的密文？'
            + '<form method="POST" action="/' + (new Date().getTime()) + '/msgcenter/encrypted/-/do">'
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
            respond(302, '/msgcenter/encrypted');
        };
    };
};



/*
 * Logic to apply job
 */
module.exports = function(queues, parameter, post, respond, urlcommand){
    function backToIndex(){
        respond(302, '/msgcenter/encrypted');
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
    if(!/^(remove|send)$/i.test(action))
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
        default:
            backToIndex();
            break;
    };
};
