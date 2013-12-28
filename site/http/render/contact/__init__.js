var router = $.net.urlRouter();
module.exports = router;

router
    .handle('', require('./get.js'))
    .handle('add', require('./showinfo.js'))
    .handle('detail', require('./detail.js'))
    .handle('remove', require('./showinfo.js'))
;

router.proxy = function(template){
    return function(data){
        var content, title;

        var childData = template(data);
        content = childData.content;
        title = childData.title;

        return {
            title: '联系人' + (title?' > ' + title:''),
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
        }
    };
};
