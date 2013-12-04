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
    ret += '</table>';
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
