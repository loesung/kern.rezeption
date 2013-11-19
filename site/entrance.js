outputPage = function(e, data){
    var output    
        = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
        + '<html><head><meta http-equiv="Content-Type" content="application/html; charset=utf-8" /><title>'
        + data['title'] + '</title>'
        + ((undefined == data['head'])?'':data['head'])
        + '<style type="text/css">'
            + 'body{background: #FFFFFF;}'
            + 'table{width: 98%;}'
            + '#hidden{display: none}'
        + '</style>'
        + '</head><body>'
        + '<div id="hidden">请打开本地CSS渲染。Dillo菜单的Tools-&gt;Use embedded CSS。</div>'
        + '<table>'     // No, no, I don't like it either. But this is the 
                        // very practical way to display on a damnly small
                        // browser like Dillo.
          + '<tr>'
            + '<td width="20%">Hello'
            + '</td>'
            + '<td width="100%">' + data['content'] + '</td>'
          + '</tr>'
        + '</table>'
        + '</body></html>'
    ;
    e.response.writeHead(200);
    e.response.end(output);
};

var routerTable = {
    '^\/$': require('./page.index.js'),
};

module.exports = function(e){
    var handled = false;
    for(var expression in routerTable){
        var regexp = new RegExp(expression);
        var result = regexp.exec(e.request.url);
        if(null != result){
            routerTable[expression](e, result);
            handled = true;
            break;
        };
    };

    if(!handled){
        outputError(e, 404);
    };
};
