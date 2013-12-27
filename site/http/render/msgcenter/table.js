module.exports = function(pageName){
    return function(data){
        var output = '<form method="POST" action="/' + (new Date().getTime()) + '/msgcenter/' + pageName + '/process">'
            +'<table class="report" cellspacing="0" cellpadding="0" style="font-size: 9pt">'
            + '<tr class="head">'
            +   '<td width="20%">时间</td>'
            +   '<td>内容(提示)</td>'
            +   '<td width="5%">选择</td>'
            + '</tr>'
        ;

        var pager = data.pager,
            items = data.items;


        if(items.length < 1){
            output += '<tr><td colspan="3">'
                + '当前没有项目</td></tr>'
                + '</table></form>';
        } else {
            for(var i in items){
                var item = item[i];
                output 
                    += '<tr>'
                    +       '<td>' + _.format.time2Full(
                                        new Date(item.timestamp * 1000)
                        ) + '</td>'
                    +       '<td class="hint">' + item.comment + '</td>'
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
                            + '/msgcenter/' + pageName + '/' + i + '">' + i + '</a>]')
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

        return output;
    };
};
