module.exports = function(e, matchResult){
    var output
        = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
        + '<html><head>'
        + '<meta http-equiv="Content-Type" content="application/html; charset=utf-8" />'
        + '<title>' + CONFIG.get('site-name') + '</title>'
        + '<style type="text/css">body{text-align:center;}</style>'
        + '</head><body>'
        + '<h1>' + '主页' + '</h1>'
        + '<br /><hr />'
        + '<font color="#FF0000">LOESUNG-PROJECT</font> Reception Server'
        + '</body></html>'
    ;
    e.response.end(output);
};
