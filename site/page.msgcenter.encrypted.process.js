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
 * Send messages to Botschaft
 */
function send(queues, ids, phase, post, respond){
    /*
     * Bei der Sendung soll der Benutzer die Richtungen auswaehlen. Als Verzug
     * werden alle Richtungen gelistet. Dennoch koennen wir spaeter ein Filter
     * einsetzen, wenn Empfaenger einiger Nachrichten schon eingegeben haben.
     */
    if(phase == 0){
        // display user selection page
        content = '请输入或选择接收人。';
    } else if(phase == 1){
        if(null == tunnels){
            content = '当前尚未在通讯系统中找到为ID <font color="#FF0000">'
                + receiverID
                + '</font> 提供的通讯信道。'
                + '<br />请检查通讯系统设置和启动情况，然后刷新页面。'
            ;
        } else {
            content = '下面列出通讯系统为您提供，与用户 <font color="#FF0000">' 
                + receiverID + '</font> 联系所用的信道。'
                + '<table class="report" cellspacing="0px" cellpadding="3px">'
                + '<tr class="head">'
                + '<td width="10%">类型</td>'
                + '<td width="10%">方式</td>'
                + '<td width="10%">协议</td>'
                + '<td>说明</td>'
                + '</tr>'
            ;

            var listed = tunnels.list(), tunnelID;
            for(var tunnelID in listed){
                idInfo = listed[tunnelID];
                tunnelInfo = tunnels.info(tunnelID);
                if(!tunnelInfo) continue;

                content += '<tr>';

                content += '<td>';
                if(/^(internet|satellite|mobile)$/.test(idInfo.catalog))
                    content += '<img src="/static/catalog.'
                        + idInfo.catalog + '.png"></img>';
                content += '</td>';

                content += '<td>';
                if(/^(im|email|web)$/.test(idInfo.method))
                    content += '<img src="/static/method.'
                        + idInfo.method + '.png"></img>';
                else
                    content += '其他';
                content += '</td>';
                
                content += '<td>';
                if(/^(xmpp)$/.test(idInfo.protocol))
                    content += '<img src="/static/protocol.'
                        + idInfo.protocol + '.png"></img>';
                else
                    content += idInfo.protocol;
                content += '</td>';

                content += '<td>' + tunnelInfo.description + '</td></tr>';
            };

            content += '</table>';
        };

    respond(null, content);
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
        case 'send':
            send(queues, objectIDs, phase, post, respond);
            break;
        default:
            backToIndex();
            break;
    };
};
