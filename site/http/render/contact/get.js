function shortID(i){
    var s = i.toUpperCase().substr(0,16);
    return [s.substr(0,4), s.substr(4,4), s.substr(8,4), s.substr(12,4)]
        .join(' ')
    ;
};

module.exports = function(data){
    var ret = '<table class="report" cellspacing="0px" cellpadding="1px">'
        + '<tr class="head">' 
            + '<td width="25%">短识别ID</td>'
            + '<td>名称</td>'
            + '<td width="12%">操作</td>'
        + '</tr>'
    ;

    if(data.length > 0){
        for(var i in data){
            ret += ''
                + '<form method="POST" action="/contact/detail">'
                + '<input style="display: none" type="hidden" name="id" value="' + data[i].id + '"/>'
                + '<tr>'
                + '<td>' + shortID(data[i].id) + '</td>'
                + '<td>' + data[i].name + '</td>'
                + '<td>'
                +   '<button type="submit">查看详情</button>'
                + '</td>'
                + '</tr>'
                + '</form>' 
            ;
        };
    } else {
        ret += ''
            + '<tr><td colspan="3">当前无联系人</td></tr>'
        ;
    };

    ret += ''
        + '</table>'

        + '<form method="POST" action="/contact/add?_=' + process.hrtime()[1] + '">'
        + '<table><tr><td>新增联系人：请输入名称</td><td>'
        + '<input name="name" type="text" size="50" /></td>'
        + '<td><button type="submit">增加</button></td></tr></table>'
        + '</form>'
    ;

    return {
        title: false,
        content: ret,
    };
};
