/*
 * Manage tunnels, and provides a page to user
 */

function statistics(callback){
    callback(null, '');
};

function showReceiver(receiverID, callback){
    callback(null, 
        '<table class="report" cellspacing="0px" cellpadding="3px">'
        + '<tr class="head">'
        + '<td width="20%">项目</td>'
        + '<td width="15%">状态</td>'
        + '<td>解释</td>'
        + '</tr>'
        + '</table>',
        '详细信息'
    );
};

module.exports = function(e, matchResult, rueckruf){
    $.global.get('botschaft').refreshTunnelInfo();

    var showReceiverID = matchResult[3];

    function respond(err, content, title){
        outputPage(e, {
            title: '密文信道监视器' + (title?(' > ' + title):''),
            content: content,
            head
                : '<style type="text/css">'
                  + '.report{border: #CCCCCC 1px solid; width: 100%}'
                  + '.report td{border: #CCCCCC 0.5px solid;}'
                  + '.report .head{background: #CCCCCC;}'
                  + '.report .switch{font-weight: bold; text-align: center}'
                  + '.report .good{background: #00C000; color: #FFFFFF}'
                  + '.report .error{background: #BB0000; color: #FFFF00}'
                  + '.report .unknow{background: #FFDD00; color: #FF0000}'
                + '</style>'
            ,
        });
        rueckruf(null);
    };

    if(undefined != showReceiverID){
        showReceiver(showReceiverID, respond);
    } else {
        statistics(respond);
    };
};
