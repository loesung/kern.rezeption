var handlers = {};

handlers.get = function(identity, callback){
    $.nodejs.async.waterfall([
        identity.list,

        function(json, callback){
            callback(null, tablize(json));
        },

    ], callback);
};


handlers.detail = function(identity, post, callback){
    var identityInfo = null,
        codebookInfo = null;

    $.nodejs.async.waterfall([
        function(callback){
            identity.query(post.parsed.id, callback);
        },

        function(json, callback){
            identityInfo = json;
            callback(null);
        },

        function(callback){
            // TODO check for codebooks
            callback(null);
        },

    ], function(err, result){
        callback(null, 'building');
    });
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

module.exports = function(e, matchResult, rueckruf){
    var identity = _.identity(IPC['datenbank']);
    var subcommand = matchResult[3];

    function respond(err, content){
        if(null != err){
            content = '错误：无法连接到数据中心。';
        };
        outputPage(e, {
            title: '联系人',
            content
                : '' 
                + '<br />'
                + content
            ,
            head
                : '<style type="text/css">'
                  + '.report{border: #CCCCCC 1px solid; width: 100%}'
                  + '.report td{border: #CCCCCC 0.5px solid;}'
                  + '.report .head{background: #CCCCCC;}'
                  + '.report button{font-size: 9pt; text-align: center; background: #FFAAAA;}'
                + '</style>'
        });
    };

    if(e.method == 'post'){
        function waitAndRespond(handler){
            e.on('ready', function(post){
                handler(identity, post, respond);
            });
        };
        switch(subcommand){
            case 'detail':
                waitAndRespond(handlers.detail);
                break;
            default:
                break;
        };
    } else {
        handlers.get(identity, respond);
    };
};
