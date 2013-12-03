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
            if(null == json){
                callback(true);
            } else {
                identityInfo = json;
                callback(null);
            };
        },

        function(callback){
            // TODO check for codebooks
            callback(null);
        },

    ], function(err, result){
        if(null != err){
            callback(null, '错误：找不到对应的项目。可能是项目已经被删除。');
            return;
        };


        function prettyID(id){
            id = id.trim().toUpperCase();
            var breaked = [];
            var color = 0;
            while(id != '' && color < 100){
                breaked.push((
                    (color == 0?'<font color="#FF0000">':'') + 
                    id.substr(0,4) + 
                    (color == 3?'</font>':'')
                ));
                color += 1;
                id = id.substr(4);
            };
            var line = [];
            var output = [];
            for(var i in breaked){
                line.push(breaked[i]);
                if(line.length >= 8){
                    output.push(line.join(' '));
                    line = [];
                };
            };
            if(line.length > 0) output.push(line.join(' '));
            return output.join('<br />');
        };
        function breakBlock(block, width){
            var output = '';
            var counter = 0;
            while(block != ''){
                output += block.substr(0,1);
                block = block.substr(1);
                counter += 1;
                if(counter == width){
                    output += '<br />';
                    counter = 0;
                };
            };
            output += block;
            return output;
        };
        var output = ''
            + '<table class="report" cellpadding="0" cellspacing="0">'
            +   '<tr class="head">'
            +       '<td>全名</td>'
            +       '<td width="55%">识别ID</td>'
            +   '</tr>'
            +   '<tr>'
            +       '<td>' + breakBlock(identityInfo.name, 32) + '</td>'
            +       '<td>' + prettyID(identityInfo.id) + '</td>'
            +   '</tr>'
            +   '<tr class="head">'
            +       '<td colspan="2">'
            +           '<table class="fineLine" cellspacing="0" cellpadding="0">'
            +               '<form method="POST" action="/' + (new Date().getTime()) + '/contact/remove">' 
            +                   '<input type="hidden" value="' + identityInfo.id + '">' 
            +                   '<tr>'
            +                       '<td>删除：请抄写识别ID前16位字母 <input type="text" name="confirm" size="17" maxlength="16"/></td>'
            +                       '<td><button type="submit">确定删除</button></td>'
            +                   '</tr>'
            +              '</form>'
            +              '<form method="GET" action="/' + (new Date().getTime()) + '/codebook/' + identityInfo.id + '">' 
            +                   '<tr>'
            +                       '<td>要查看、新增或管理本机用于和此联系人进行机密通信的密码本，请点击：</td>'
            +                       '<td><button type="submit">管理密码本</button></tr>'
            +                  '</tr>'
            +              '</form>'
            +           '</table>'
            +       '</td>'
            +   '</tr>'

            + '</table>'
        ;
        callback(null, output);
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
    var subtitle = false;

    function respond(err, content){
        if(null != err){
            content = '错误：无法连接到数据中心。';
        };
        outputPage(e, {
            title: '联系人' + (subtitle?' > ' + subtitle:''),
            content: content,
            head
                : '<style type="text/css">'
                  + 'input[type="hidden"]{display: none}'
                  + 'td{word-break:break-all}'
                  + '.report{border: #CCCCCC 1px solid; width: 100%}'
                  + '.report td{border: #CCCCCC 0.5px solid;}'
                  + '.report .head{background: #CCCCCC;}'
                  + '.report button,input{font-size: 9pt; text-align: center; background: #FFAAAA;}'
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
                subtitle = "详细信息";
                waitAndRespond(handlers.detail);
                break;
            default:
                break;
        };
    } else {
        handlers.get(identity, respond);
    };
};
