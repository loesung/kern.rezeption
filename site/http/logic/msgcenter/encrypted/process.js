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
    var workflow = [];


    var receiverList = [],
        isPost = (null != post);
    if(isPost){
        // extract the intended receiver
        var value, isReceiverID = /^[0-9a-f]+$/i;
        for(var key in post.parsed){
            value = post.parsed[key];
            if(!isReceiverID.test(value)) continue;
            if(key.substr(0, 8) == 'receiver') receiverList.push(value);
        };
    };

    /*
     * TODO
     * 1. query of identity is common for all phases, and remove in time of
     *  those receviers who are not in list of identity.
     * 2. use this workflow to change the terminal handler, which are of
     *  different phases.
     * 3. the 'send' choice of phase#0 will shift this program to next phase,
     *  without sending back data immediately
     */

    // phase of selecting intended user.
    if(phase == 0){
        var identity = _.identity(IPC['datenbank']);
        var choice = (isPost?post.parsed['choice']:false),
            keyword = (isPost?post.parsed['keyword']:false),
            nextPhase = false,
            identityIndexed = {};

        if(choice == 'cancel') return respond(302, '/msgcenter/encrypted');
        
        // query for newest identity list
        workflow.push(identity.list);
        workflow.push(function(json, callback){
            for(var i in json)
                identityIndexed[json[i].id] = json[i].name;
            callback(null);
        });

        
        if(choice == 'search'){
            var keyword = (isPost?post.parsed['keyword']:false);

            // decide keyword
            if($.types.isString(keyword) && keyword.length > 3){
                keyword = keyword.trim().toLowerCase();
                workflow.push(function(callback){
                    var likeID = /^[0-9a-f]{4,}$/.test(keyword),
                        item;
                    for(var id in identityIndexed){
                        item = identityIndexed[id];
                        if(likeID)
                            if(id.toLowerCase().startsWith(keyword)){
                                receiverList.push(id);
                                continue;
                            };
                        if(item.toLowerCase().indexOf(keyword) >= 0){
                            receiverList.push(id);
                            continue;
                        };
                    };

                    callback(null);
                });
            };

            // done
        };

        var endHandler;
        if(!nextPhase){
            endHandler = function(err, result){
                content = '<form method="POST" action="/' + (new Date().getTime()) + '/msgcenter/encrypted/-/do">'
                    + akashicForm(ids, phase - 1, 'send')
                    + '<table><tr><td>为 <font color="#FF0000">' + ids.length +  '</font> 条消息输入或选择接收人：'
                    + '</td><td><input type="text" name="keyword" /></td>'
                    + '<td><button class="navbutton" type="submit" name="choice" value="search">搜索</button></td>'
                    + '<td><button class="navbutton btn-special">发送</button></td>'
                    + '<td><button class="navbutton" type="submit" name="choice" value="cancel">取消</button></td>'
                    + '</tr></table>'
                    + '<table cellspacing="0" cellpadding="0"><tr><td>已选定的接收人（去掉勾选则删除）：</td></tr>'
                ;

                var setItem = false;
                if(receiverList.length > 0){
                    for(var i in receiverList){
                        if(!identityIndexed[receiverList[i]]) continue;
                        content += '<tr>'
                            + '<td><input type="checkbox" name="receiver' + i + '" value="' + receiverList[i] + '" checked="true"/>'
                            + '' + identityIndexed[receiverList[i]] + '</td>'
                            + '</tr>'
                        ;
                        setItem = true;
                    };
                };
                if(!setItem)
                    content += '<tr><td colspan="3">尚无</td></tr>';

                content += ''
                    + '</table>'
                    + '</form>'
                ;

                respond(null, content);
            };
        };

        $.nodejs.async.waterfall(workflow, endHandler);
    };
   

    // phase may shift to 1 in the previous logic. Therefore we do NOT join
    // them using a 'else'.
 
    // phase of selecting tunnels, according to the user selection.
    if(phase == 1){
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

    } else {
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
    var isID = /[0-9a-f]{8}\-([0-9a-f]{4}\-){3}[0-9a-f]{12}/i;
    var isPost = $.types.isObject(post);

    /* Determine objects being operated
     * - if by post, read posted body.
     * - read parameter
     * Anyway, use isID.test() to filter all id.
     */
    var objectIDs = [],
        parameters = parameter.split('.');
    for(var i in parameters)
        if(isID.test(parameters[i]))
            objectIDs.push(parameters[i].toLowerCase());
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
