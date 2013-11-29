module.exports = function(e, matchResult, rueckruf){
    outputPage(e, {
        title: '撰写消息',
        content
            : '<form action="/' + String(new Date().getTime()) + '/compose" method="POST">'
            + '请在下面的文本框中编辑您的消息。您可以使用Ctrl+C和Ctrl+V复制粘贴。'
            + '<textarea cols="70" rows="8"></textarea>'
            + '<br />请选择接收人：'
            + '</form>'
        ,
        head
            : '<style type="text/css">'
            +   'form textarea{background: #FFFFCC}'
            + '</style>'
        ,
    });

    rueckruf(null);
};
