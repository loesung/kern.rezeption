function identityDriver($, ipc){
    var self = this;

    function callbackGenerator(callback){
        return function(err, packet){
            if(null != err){
                console.log(err);
                callback(true);
                return;
            };
            packet.on('ready', function(post){
                var errSig = (packet.response.statusCode == 200?null:true);
                try{
                    var json = JSON.parse(post.raw);
                    callback(errSig, json)
                } catch (e){
                    callback(errSig, json);
                };
            });
        };
    };

    this.add = function(data, callback){
        var opt = {
            post: $.nodejs.querystring.stringify({
            }),
        };
        ipc.request('/identity/add', callbackGenerator(callback), opt);
    };

    this.list = function(callback){
        ipc.request('/identity/', callbackGenerator(callback));
    };

    this.remove = function(id, callback){
        ipc.request('/identity/remove/' + id, callbackGenerator(callback), {
            post: '.',
        });
    };

    this.query = function(id, callback){
        ipc.request('/identity/query/' + id, callbackGenerator(callback));
    };

};

module.exports = function($, _){
    return function(dbipc){
        return new identityDriver($, dbipc);
    };
};

