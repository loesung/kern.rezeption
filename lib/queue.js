function queueDriver($, ipc, tag){
    var self = this;

    var tags = {
        'send-': '01',
    };

    if(undefined == tags[tag]){
        throw String("Wrong tag name input. Check the program.").ERROR();
        return;
    };

    this.push = function(data, callback){
        var opt = {
            post: $.nodejs.querystring.stringify({
                data: data,
                id: '',
                tag: tag,
            }),
        };
        ipc.request('/queue/add', callback, opt);
    };

    this.list = function(callback){
        ipc.request('/queue/search/', callback);
    };

    this.remove = function(id, callback){
    };

    this.query = function(id, callback){
    };

};

function init($, _, dbipc){
    
};

module.exports = function($, _){
    return function(dbipc){
        return new init($, _, dbipc);
    };
};
