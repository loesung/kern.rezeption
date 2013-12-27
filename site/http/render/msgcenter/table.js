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


        var noItem = (items.length < 1);
        if(noItem){
            output += '<tr><td colspan="3">'
                + '当前没有项目</td></tr>'
                + '</table></form>';
        } else {
            for(var i in items){
                var item = items[i];
                output 
                    += '<tr>'
                    +       '<td>' + _.format.time2Full(
                                        new Date(item.timestamp * 1000)
                        ) + '</td>'
                ;

                if('plaintext' == pageName || 'decrypted' == pageName)
                    output += '<td>' + item.data + '<span class="hint">(' + item.comment + ')</span></td>';
                else
                    output += '<td class="hint">' + item.comment + '</td>';

                output += '<td><input type="checkbox" name="item' + i + '" value="' + item.id + '"/></td></tr>';
            };
            output += '</table>'
                + '第' + pager.current + '页/共' + pager.max + '页 '
                + pager.navigateBar(function(i, cur){
                    if(cur)
                        return ('[<font color="#FF0000">' + i + '</font>]');
                    else
                        return ('[<a href="/msgcenter/' + pageName + '/?page=' + i + '&_=' + process.hrtime()[1] + '">' + i + '</a>]')
                        ;
                    }
                )
            ;

            if('encrypted' == pageName)
                output += ''
                    + '<br /><table><tr><td>选中项目：</td>'
                    + '<td><select name="do">'
                    +   '<option value="send">选择信道并发送</option>'
                    +   '<option value="remove">删除</option>'
                    + '</select></td>'
                    + '<td><button type="submit">操作</button></td>'
                    + '</tr></table>'
                    + '</form>'
                ;

            if('plaintext' == pageName)
                output += ''
                    + '<table><tr><td><a href="/' + (new Date().getTime()) + '/compose">撰写新消息</a>，或对选中项目：</td>'
                    + '<td><select name="do"' + (noItem?' disabled="disabled"':'') + '>'
                    +   '<option value="passphrase" selected>加密，使用临时输入的口令</option>'
                    +   '<option value="codebook">加密，指定一个或多个收件人，使用密码本</option>'
                    +   '<option value="sign">使用公钥签署，但不加密</option>'
                    +   '<option value="remove">删除</option>'
                    + '</select></td>'
                    + '<td><button type="submit"' + (noItem?' disabled="disabled"':'') + '>操作</button></td>'
                    + '</tr></table>'
                    + '</form>'
                ;
        };

        return output;
    };
};
