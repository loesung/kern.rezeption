module.exports = function(e, matchResult, rueckruf){
    var queues = _.queue(IPC['datenbank']);

    function respond(err, content){
        outputPage(e, {
            title: '联系人',
            content
                : [
                ].join(' ')
                + '<br />'
                + content
            ,
        });
    };

    if(e.method == 'post'){
    } else {
        respond('', '');
    };
};
