function tablize(list, showPage){
    list.sort(function(a,b){
        return ((a.name < b.name)?1:-1);
    });

    var perPage = 10,
        maxPage = Math.ceil(list.length / perPage);

    if(isNaN(showPage))
        showPage = 1;
    else {
        showPage = Math.floor(showPage);
        if(showPage < 1) showPage = 1;
        if(showPage > maxPage) showPage = maxPage;
    }

    var ret = '<table class="report" cellspacing="0px" cellpadding="1px">'
        + '<tr class="head">' 
            + '<td width="25%">短识别ID</td>'
            + '<td>名称</td>'
            + '<td width="12%">操作</td>'
        + '</tr>'
    ;

    function shortID(i){
        var s = i.toUpperCase().substr(0,16);
        return [s.substr(0,4), s.substr(4,4), s.substr(8,4), s.substr(12,4)]
            .join(' ')
        ;
    };

    if(list.length > 0){
        for(var i in list){
            ret += ''
                + '<form method="POST" action="/' + (new Date().getTime()) + '/contact/detail">'
                + '<input style="display: none" type="hidden" name="id" value="' + list[i].id + '"/>'
                + '<tr>'
                + '<td>' + shortID(list[i].id) + '</td>'
                + '<td>' + list[i].name + '</td>'
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

        + '<form method="POST" action="/' + (new Date().getTime()) + '/contact/add">'
        + '<table><tr><td>新增联系人：请输入名称</td><td>'
        + '<input name="name" type="text" size="50" /></td>'
        + '<td><button type="submit">增加</button></td></tr></table>'
        + '</form>'
    ;
    return ret;
};

module.exports = function(identity, callback){
    $.nodejs.async.waterfall([
        identity.list,

        function(json, callback){
            callback(null, tablize(json));
        },

    ], callback);
};
