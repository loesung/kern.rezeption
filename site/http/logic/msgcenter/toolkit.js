function pageToolkit(pageName){
    var self = this;
    
    var hrtime = process.hrtime()[1];

    this.backToIndex = function(respond){
        respond(302, '/msgcenter/' + pageName + '/?_=' + hrtime);
    };

    this.forwardProcess = function(to, ids, respond){
        var form = {
            _: hrtime,
        };
        for(var i in ids){
            form['item' + i] = ids[i];
        };

        respond(
            302,
            '/msgcenter/' + to + '/process?' 
            + $.nodejs.querystring.stringify(form)
        );
    };

    this.remove = function(queues, ids, phase, data, respond){
        var output = '';
        var queue = {
            encrypted: queues.send.proceeded,
            plaintext: queues.send.pending,
        }[pageName] || undefined;

        function worker(){
            var task = [];
            for(var i in ids){
                task.push((function(){
                    var itemID = ids[i];
                    return function(callback){
                        queue.remove(itemID, function(){
                            callback(null);
                        });
                    };
                })());
            };
            $.nodejs.async.parallel(task, function(err){
                self.backToIndex(respond);
            });
        };

        if(0 == phase){
            respond(null, {
                type: 'remove',
                ids: ids,
                phase: phase,
            });
        } else {
            if('y' == data.post['confirm']){
                worker();
            } else {
                self.backToIndex(respond);
            };
        };
    };

    return this;
};

module.exports = function(pageName){
    return new pageToolkit(pageName);
};
