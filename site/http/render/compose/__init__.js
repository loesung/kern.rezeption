var router = $.net.urlRouter();
module.exports = router;

router.proxy = function(template){
    return function(data){
/*        if(null != err){
            if(302 == err){
                e.response.writeHead(
                    302,
                    {'Location': '/' + (new Date().getTime()) + content}
                );
                e.response.end();
                return;
            };

            if(!$.types.isString(content))
                content = '错误：无法连接到数据中心。';
            content = '<br />'
                + content
                + '<form method="GET" action="/' + (new Date().getTime()) + '/compose">'
                +   '<button class="navbutton btn-active" type="submit">返回</button>'
                + '</form>'
            ;
        };*/

        var childData = template(data);

        return {
            title: '撰写消息',
            content: childData,
            head
                : '<style type="text/css">'
                +   'form textarea,input{background: #FFFFCC}'
                + '</style>'
            ,
        };
    };
};

router
    .handle('write', require('./write.js')())
    .handle('save', require('./save.js')())
;
