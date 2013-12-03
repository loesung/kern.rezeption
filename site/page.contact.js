var handlers = {};

handlers.get = function(identity, callback){
    $.nodejs.async.waterfall([
        identity.list,

        function(json, callback){
            callback(null, tablize(json));
        },

    ], callback);
};

function tablize(list, showPage){
    list.sort(function(a,b){
        return a.name < b.name;
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
            + '<td width="20%">操作</td>'
        + '</tr>'
    ;

    function shortID(i){
        var s = i.toUpperCase().substr(0,16);
        return [s.substr(0,4), s.substr(4,4), s.substr(8,4), s.substr(12,4)]
            .join(' ')
        ;
    };

    for(var i in list){
        ret += '<tr>'
            + '<td>' + shortID(list[i].id) + '</td>'
            + '<td>' + list[i].name + '</td>'
            + '<td>' + '删除' + '</td>'
            + '</tr>'
        ;
    };
    ret += '</table>';
console.log(ret);
    return ret;
};

module.exports = function(e, matchResult, rueckruf){
    var identity = _.identity(IPC['datenbank']);

    function respond(err, content){
        if(null != err){
            content = '错误：无法连接到数据中心。';
        };
        outputPage(e, {
            title: '联系人',
            content
                : [
                ].join(' ')
                + '<br />'
                + content
            ,
            head
                : '<style type="text/css">'
                  + '.report{border: #CCCCCC 1px solid; width: 100%}'
                  + '.report td{border: #CCCCCC 0.5px solid;}'
                  + '.report .head{background: #CCCCCC;}'
                + '</style>'
        });
    };

    if(e.method == 'post'){
    } else {
        handlers.get(identity, respond);
    };
};
