function botschaft($, _, ipc){
    var self = this;

    var tunnels = [], lastUpdate = false;

    this.refresh = function(){
        String('Refresh tunnel info.').NOTICE();
        ipc.request('/', function(err, packet){
            if(null != err) return;
            packet.on('ready', function(post){
                console.log(post);
            });
        });
    };

    this.send = function(tunnel, message){
    };

    return this;
};

module.exports = function($, _){
    return function(ipc){
        return new botschaft($, _, ipc);
    };
};
