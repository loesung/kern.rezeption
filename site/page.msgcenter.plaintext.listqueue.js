var PER_PAGE = 8;
module.exports = function(queues, parameter, post, respond){
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
        var output = '<form method="POST" action="/' + (new Date().getTime()) + '/msgcenter/plaintext/-/do">'
            +'<table class="report" cellspacing="0" cellpadding="0" style="font-size: 9pt">'
            + '<tr class="head">'
            +   '<td width="20%">时间</td>'
            +   '<td>内容</td>'
            +   '<td width="5%">选择</td>'
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
                        + '/msgcenter/plaintext/' + i + '">' + i + '</a>]')
                    ;
                }
            )
            + '<br /><table><tr><td>选中项目：</td>'
            + '<td><select name="do">'
            +   '<option value="passphrase" selected>加密，使用临时输入的口令</option>'
            +   '<option value="codebook">加密，指定一个或多个收件人，使用密码本</option>'
            +   '<option value="sign">使用公钥签署，但不加密</option>'
            +   '<option value="remove">删除</option>'
            + '</select></td>'
            + '<td><button type="submit">操作</button></td>'
            + '</tr></table>'
            + '</form>'
        ;

        respond(null, output);
    });
};
