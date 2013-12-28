var router = $.net.urlRouter();
module.exports = router;

router.proxy = function(template){
    return function(data){
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
