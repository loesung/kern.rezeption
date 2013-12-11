function queueDriver($, ipc, tag){
    var self = this;

    var tags = {
        'send-pending': '01',
        'send-proceeded': '02',
        'receive-pending': '03',
        'receive-proceeded': '04',
    };
    var tagID = tags[tag];

    if(undefined == tagID){
        throw String("Wrong tag name input. Check the program.").ERROR();
        return;
    };

    function callbackGenerator(callback){
        return function(err, packet){
            if(undefined == callback) return;
            if(null != err){
                String('Queue callback error: ' + JSON.stringify(err)).ERROR();
                callback(true);
                return;
            };
            packet.on('ready', function(post){
                var errSig = (packet.response.statusCode == 200?null:true);

                if(null != errSig)
                    String('IPC Call from queue returned error. Code:' +
                        packet.response.statusCode
                    ).DEBUG();

                try{
                    var json = JSON.parse(post.raw);
                    callback(errSig, json)
                } catch (e){
                    callback(errSig, json);
                };
            });
        };
    };

    this.push = function(data, comment, callback){
        if(!$.types.isString(comment)) comment = '';
        var opt = {
            post: $.nodejs.querystring.stringify({
                data: data,
                comment: comment,
                tag: tagID,
            }),
        };
        ipc.request('/queue/add', callbackGenerator(callback), opt);
    };

    this.list = function(callback){
        ipc.request('/queue/search/' + tagID, callbackGenerator(callback));
    };

    this.remove = function(id, callback){
        ipc.request('/queue/remove/' + id, callbackGenerator(callback), {
            post: '.',
        });
    };

    this.query = function(id, callback){
        ipc.request('/queue/query/' + id, callbackGenerator(callback));
    };

};

function init($, _, dbipc){
    var self = this;

    this.send = {
        pending: new queueDriver($, dbipc, 'send-pending'),
        proceeded: new queueDriver($, dbipc, 'send-proceeded'),
    };

    this.receive = {
        pending: new queueDriver($, dbipc, 'receive-pending'),
        proceeded: new queueDriver($, dbipc, 'receive-proceeded'),
    };
};

module.exports = function($, _){
    return function(dbipc){
        return new init($, _, dbipc);
    };
};
