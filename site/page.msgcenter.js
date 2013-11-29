function incoming(){
};

function outgoing(){
};

function index(){
    return '这里是消息队列。通过密码核心发送和接收的消息都将经过这一部分。'
        + '<p><strong>已收到的消息。</strong>这里查看收到的消息，可进行解密或其他操作。'
        + '<p><strong>待发送的消息。</strong>您可以在消息发送之前在此进行重新审阅，确定发送路线等。'
    ;
};

module.exports = function(e, matchResult, rueckruf){
    var currentPage = matchResult[3];

    function navLink(text, target){
        if(currentPage == target)
            return '[<strong>' + text + '</strong>]';
        else
            return '[<a href="/'
                + (new Date().getTime())
                + '/msgcenter/'
                + target
                + '">'
                + text
                + '</a>]'
            ;
    };

    var mainContent = '';
    switch(currentPage){
        case 'incoming':
            mainContent = incoming();
            break;
        case 'outgoing':
            mainContent = outgoing();
            break;
        default:
            mainContent = index();
            break;
    };

    outputPage(e, {
        title: '消息队列',
        content
            : [
                navLink('已收到的消息', 'incoming'),
                navLink('待发送的消息', 'outgoing')
            ].join(' ')
            + '<br />'
            + mainContent
        ,
    });

    rueckruf(null);
};
