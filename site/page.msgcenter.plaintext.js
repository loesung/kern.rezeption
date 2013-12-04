var PER_PAGE = 8;

function listQueue(queues, parameter, post, respond){
    var workflow = [];
    var pager = null;

    workflow.push(queues.send.pending.list);

    workflow.push(function(list, callback){
        list.sort(function(a, b){
            return b.timestamp - a.timestamp;
        });

        pager = _.paging(list, PER_PAGE, parameter);

        callback(null, pager);
    });

    workflow.push(function(list, callback){
        var result = [];
        for(var i in pager.list){
            result.push((function(){
                var itemID = pager.list[i].id;
                return function(callback){
                    queues.send.pending.query(itemID, callback);
                };
            })());
        };
        $.nodejs.async.parallel(result, callback);
    });

    $.nodejs.async.waterfall(workflow, function(err, result){
        var output = '<table class="report" cellspacing="0" cellpadding="0">'
            + '<tr class="head">'
            +   '<td width="25%">时间</td>'
            +   '<td>内容</td>'
            +   '<td width="20%">操作</td>'
            + '</tr>'
        ;

        for(var i in result){
            var item = result[i];
            output 
                += '<tr>'
                +       '<td>' + _.format.time2Full(
                                    new Date(item.timestamp * 1000)
                    ) + '</td>'
                +       '<td>' + item.data + '</td>'
                +       '<td>删除|发送</td>'
                + '</tr>'
            ;
        };
        output += '</table>'
            + '第' + pager.current + '页/共' + pager.max + '页 '
            + pager.navigateBar(function(i, cur){
                if(cur)
                    return ('[<font color="#FF0000">' + i + '</font>]');
                else
                    return ('[<a href="/' + (new Date().getTime())
                        + '/msgcenter/plaintext/' + i + '">' + i + '</a>]')
                    ;
                }
            )
        ;

        respond(null, output);
    });
};

module.exports = function(queues, parameter, action, post, respond){
    console.log(parameter, action);
    if(action == undefined){
        listQueue(queues, parameter, post, respond);
    } else {
        
    };
};
