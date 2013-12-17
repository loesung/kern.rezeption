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

function receiverTunnels($, _, ipc, tunnels){
    var self = this;
    
    idList = [];
    for(var i in tunnels){
        idList.push(tunnels[i].id);
    };
    
    this.list = function(){
        var ret = {};
        for(var i in idList){
            var parsed = parseID.exec(idList[i]);
            if(null == parsed) continue;
            ret[idList[i]] = {
                catalog: parsed[1],
                method: parsed[2],
                protocol: parsed[3],
            };
        };
        return ret;
    };

    this.send = function(tunnelID, message, callback){
        if(idList.indexOf(tunnelID) < 0){
            callback(false);
            return false;
        };
        ipc.request('/submit', function(err){
            callback(err);
        }, {
            post: message,
        });
        return true;
    };

    this.info = function(tunnelID){
        var i = idList.indexOf(tunnelID);
        if(i < 0) return false;
        return tunnels[i];
    };

    return this;
};

function botschaft($, _, ipc){
    var self = this;

    var tunnels = {}, lastUpdate = false;

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
            filter = /^([0-9a-zA-Z\.\-@]+)\s+([a-zA-Z0-9\s\.\?,;:\(\)_\-]+)$/;

        var item, exec, id, desc;
        var newList = [];

        for(var i in split){
            try{
                if(split[i].length > 512) continue;
                item = split[i].trim();

                exec = filter.exec(item);
                if(null == exec) continue;
            
                id = exec[1];
                desc = exec[2];
                if(!(
                    $.security.object.check.tunnel.id(id) &&
                    $.security.object.check.tunnel.description(desc)
                )) continue;
                console.log('**', id, desc);

                /*  FIXME fix $.security.object, to provide parsing.
                 *  then fix here to make it able parsing tunnels.
                 */

                newList.push([id, desc, exec[1]]);
            } catch(e) {
                continue;
            };
        };

        if(newList.length > 0){
            var refresh = {}, receiverID;
            for(var i in newList){
                receiverID = newList[i][0][4].toLowerCase();
                if(undefined == refresh[receiverID])
                    refresh[receiverID] = [];
                refresh[receiverID].push({
                    id: newList[i][2],
                    description: newList[i][1][1],
                });
            };
            tunnels = refresh;
            lastUpdate = new Date();
        };
    };

    this.receiverTunnels = function(receiverID){
        receiverID = receiverID.trim().toLowerCase().substr(0,16);
        if(undefined == tunnels[receiverID]) return null;

        return new receiverTunnels($, _, ipc, tunnels[receiverID]);
    };

    return this;
};

module.exports = function($, _){
    return function(ipc){
        return new botschaft($, _, ipc);
    };
};
