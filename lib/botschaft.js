/*
 * Handling communication between Botschaft-System and Kernel-System
 *
 * Note:
 *  1. tunnel information exchange in a very different way: neither JSON, nor
 *     querystring. It is however very simple: only a list, containing in
 *     each line ID(which is further possible being parsed into Protocol and
 *     Accounting), and human readable information(but only english), being
 *     separated with spaces and joined with '\n'.
 */

function botschaft($, _, ipc){
    var self = this;

    var tunnels = [], lastUpdate = false;

    this.refreshTunnelInfo = function(){
        String('Refresh tunnel info.').NOTICE();
        ipc.request('/', function(err, packet){
            if(null != err) return;
            packet.on('ready', function(post){
                self.setTunnelInfo(post.raw);
            });
        });
    };

    this.setTunnelInfo = function(feed){
        var split = feed.split('\n'),
            filter = /^([0-9a-z\.\-@]+)\s+([a-zA-Z0-9\s\.\?,;:\(\)_\-]+)$/,
            parseID = /^(internet).(im|email|web|etc).([a-z0-9]+)\-([0-9a-zA-Z@\.]+)\-([0-9a-zA-Z@\.]+)$/,
            parseDesc = /^[a-zA-z0-9\s\.\?,;:\(\)\-_]+$/;

        var item, exec, id, desc;
        var newList = [];

        for(var i in split){
            try{
                item = split[i].trim();
                if(item.length > 128) continue;

                exec = filter.exec(item);
                if(null == exec) continue;
            
                id = parseID.exec(exec[1]);
                desc = parseDesc.exec(exec[2]);

                if(null == id || null == desc) continue;

                newList.push({
                    id: id,
                    desc: desc,
                });
            } catch(e) {
                continue;
            };
        };

        if(newList.length > 0){
            tunnels = newList;
            lastUpdate = new Date();
        };
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
