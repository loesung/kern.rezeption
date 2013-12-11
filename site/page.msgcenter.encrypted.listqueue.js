var PER_PAGE = 8;
module.exports = function(queues, parameter, post, respond){
    var workflow = [];
    var pager = null;

    workflow.push(queues.send.proceeded.list);

    workflow.push(function(list, callback){
        console.log(list);
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
        var output;
        if(null != err){
            output = '错误：无法连接到数据中心。';
            respond(err, output);
            return;
        };
        
        output = '<form method="POST" action="/' + (new Date().getTime()) + '/msgcenter/encrypted/-/do">'
            +'<table class="report" cellspacing="0" cellpadding="0" style="font-size: 9pt">'
            + '<tr class="head">'
            +   '<td width="20%">时间</td>'
            +   '<td>内容</td>'
            +   '<td width="5%">选择</td>'
            + '</tr>'
        ;

        if(result.length < 1){
            output += '<tr><td colspan="3">'
                + '当前没有项目</td></tr>'
                + '</table></form>';
        } else {
            for(var i in result){
                var item = result[i];
                output 
                    += '<tr>'
                    +       '<td>' + _.format.time2Full(
                                        new Date(item.timestamp * 1000)
                        ) + '</td>'
                    +       '<td>' + item.comment + '</td>'
                    +       '<td><input type="checkbox" name="item' + i + '" value="' + item.id + '"/></td>'
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
                            + '/msgcenter/encrypted/' + i + '">' + i + '</a>]')
                        ;
                    }
                )
                + '<br /><table><tr><td>选中项目：</td>'
                + '<td><select name="do">'
                +   '<option value="send">选择信道并发送</option>'
                +   '<option value="remove">删除</option>'
                + '</select></td>'
                + '<td><button type="submit">操作</button></td>'
                + '</tr></table>'
                + '</form>'
            ;
        };

        respond(null, output);
    });
};
