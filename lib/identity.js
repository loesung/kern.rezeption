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
                var errSig = (
                    packet.response.statusCode == 200?
                        null : 
                        packet.response.statusCode
                    )
                ;

                try{
                    var json = JSON.parse(post.raw);
                    callback(errSig, json)
                } catch (e){
                    callback(errSig, json);
                };
            });
        };
    };

    function getAuth(){
        var password = _.password.getPassword('geheimdienst');
        if(!password) return {};
        return {
            username: 'rezeption',
            password: password.toString('hex'),
        };
    };

    this.add = function(name, callback){
        var opt = {
            post: $.nodejs.querystring.stringify({
                name: name,
            }),
            auth: getAuth(),
        };
        ipc.request('/identity/add', callbackGenerator(callback), opt);
    };

    this.list = function(callback){
        ipc.request(
            '/identity/',
            callbackGenerator(callback),
            {
                auth: getAuth(),
            }
        );
    };

    this.remove = function(id, callback){
        ipc.request('/identity/delete', callbackGenerator(callback), {
            post: $.nodejs.querystring.stringify({
                id: id,
            }),
            auth: getAuth(),
        });
    };

    this.query = function(id, callback){
        ipc.request(
            '/identity/?id=' + id,
            callbackGenerator(callback),
            {
                auth: getAuth(),
            }
        );
    };

};

module.exports = function($, _){
    return function(dbipc){
        return new identityDriver($, dbipc);
    };
};

