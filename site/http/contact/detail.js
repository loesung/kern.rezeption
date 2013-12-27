module.exports = function(identity, callbackWrapper){
    return function(data, callback){
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
                callback(true, '错误：找不到对应的项目。可能是项目已经被删除。');
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
                + '</table>'


                + '<table class="report" cellspacing="0" cellpadding="0">'
                + '<form method="POST" action="/' + (new Date().getTime()) + '/contact/remove">' 
                + '<input type="hidden" name="id" value="' + identityInfo.id + '">' 
                +   '<tr class="head">'
                +       '<td>删除：请抄写识别ID前16位字母 <input type="text" name="confirm" size="17" maxlength="16"/> 然后按右侧按钮确定。</td>'
                +       '<td><button type="submit">确定删除</button></td>'
                +   '</tr>'
                + '</form>'

                + '<form method="GET" action="/' + (new Date().getTime()) + '/codebook/' + identityInfo.id + '">' 
                + '<tr class="head">'
                +   '<td>要查看、新增或管理本机用于和此联系人进行机密通信的密码本，请点击：</td>'
                +   '<td><button type="submit">管理密码本</button></tr>'
                + '</tr>'
                + '</form>'

                + '<form method="GET" action="/' + (new Date().getTime()) + '/tunnel/' + identityInfo.id + '">' 
                + '<tr class="head">'
                +   '<td>要查看通讯系统为此用户通讯提供的通讯信道，请点击：</td>'
                +   '<td><button type="submit">查看信道</button></tr>'
                + '</tr>'
                + '</form>'

                + '</table>'
            ;
            callback(null, output);
        });
    };
};

