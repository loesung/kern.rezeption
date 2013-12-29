function pageToolkit(pageName){
    var self = this;

    this.akashicForm = function(ids, phase, action){
        /* Use between phases, to let the server program recall what to do. */
        var kvs = {
            'phase': phase + 1,
            'do': action,
        };
        for(var i in ids)
            kvs['item' + i] = ids[i];
        output = '';
        for(var key in kvs){
            output += 
                '<input type="hidden" name="'
                + key + '" value="' + kvs[key] + '" />'
            ;
        };
        return output;
    };

    
    this.deleteConfirm = function(pageName){
        return function(data){
            var msgDesc = {
                plaintext: '待加密的消息',
                encrypted: '密文',
            }[pageName] || '消息';
            
            return '确定删除' + data.ids.length + '条' + msgDesc + '？'
                + '<form method="POST" action="/msgcenter/' + pageName + '/process?_=' + (new Date().getTime()) + '">'
                + self.akashicForm(data.ids, data.phase, 'remove')
                + '<table><tr><td><button type="submit" name="confirm" value="y">确定</button></td>'
                + '<td><button type="submit" name="confirm" value="n">取消</button></td></tr></table>'
                + '</form>'
            ;
        };
    };

    this.tableDrawer = require('./table.js');
   
    return this;
};

module.exports = function(pageName){
    return new pageToolkit(pageName);
};
