/*
 * Manage tunnels, and provides a page to user
 */
module.exports = function(e, matchResult, rueckruf){
    $.global.get('botschaft').refreshTunnelInfo();

    var content = '';
    if(false == true){
        content = '在查询中出现错误。';
    } else {
        content += '<table class="report" cellspacing="0px" cellpadding="3px">'
            + '<tr class="head">'
              + '<td width="20%">项目</td>'
              + '<td width="15%">状态</td>'
              + '<td>解释</td>'
            + '</tr>'
        ;
        content += '</table>';
    };

    outputPage(e, {
        title: '密文信道监视器',
        content
            : '系统已经试图刷新密文信道。可稍后再次刷新确认。'
            + '下表列出统计结果。适用信道的详细信息将在您发送消息时显示。'
            + content
            + '<br />'
        ,
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
