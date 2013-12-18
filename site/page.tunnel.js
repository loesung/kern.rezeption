/*
 * Manage tunnels, and provides a page to user
 */

function statistics(callback){
    callback(null, '');
};

function showReceiver(receiverID, callback){
    receiverID = receiverID.substr(0,16).toUpperCase();
    var tunnels = $.global.get('botschaft').receiverTunnels(receiverID),
        content
    ;

    if(null == tunnels){
        content = '当前尚未在通讯系统中找到为ID <font color="#FF0000">'
            + receiverID
            + '</font> 提供的通讯信道。'
            + '<br />请检查通讯系统设置和启动情况，然后刷新页面。'
        ;
    } else {
        content = '下面列出通讯系统为您提供，与用户 <font color="#FF0000">' 
            + receiverID + '</font> 联系所用的信道。'
            + '<table class="report" cellspacing="0px" cellpadding="3px">'
            + '<tr class="head">'
            + '<td width="10%">类型</td>'
            + '<td width="10%">方式</td>'
            + '<td width="10%">协议</td>'
            + '<td>说明</td>'
            + '</tr>'
        ;

        var listed = tunnels.list(), tunnelID;
        for(var tunnelID in listed){
            idInfo = listed[tunnelID];
            tunnelInfo = tunnels.info(tunnelID);
            if(!tunnelInfo) continue;

            content += '<tr>';

            content += '<td>';
            if(/^(internet|satellite|mobile)$/.test(idInfo.catalog))
                content += '<img src="/static/catalog.'
                    + idInfo.catalog + '.png"></img>';
            content += '</td>';

            content += '<td>';
            if(/^(im|email|web)$/.test(idInfo.method))
                content += '<img src="/static/method.'
                    + idInfo.method + '.png"></img>';
            else
                content += '其他';
            content += '</td>';
            
            content += '<td>';
            if(/^(xmpp)$/.test(idInfo.protocol))
                content += '<img src="/static/protocol.'
                    + idInfo.protocol + '.png"></img>';
            else
                content += idInfo.protocol;
            content += '</td>';

            content += '<td>' + tunnelInfo.description + '</td></tr>';
        };

        content += '</table>';
    };

    callback(null, content, '详细信息');
    /*
        '<table class="report" cellspacing="0px" cellpadding="3px">'
        + '<tr class="head">'
        + '<td width="20%">项目</td>'
        + '<td width="15%">状态</td>'
        + '<td>解释</td>'
        + '</tr>'
        + '</table>',
        '详细信息'
    );*/
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
