var PER_PAGE = 8;
module.exports = function(queues){
    return function(data, callback){
        var workflow = [];
        var pager = null;

        workflow.push(queues.receive.pending.list);

        workflow.push(function(list, callback){
            console.log(list);
            list.sort(function(a, b){
                return b.timestamp - a.timestamp;
            });

            pager = _.paging(list, PER_PAGE, 'ciphertext');

            callback(null, pager);
        });

        workflow.push(function(list, callback){
            var result = [];
            for(var i in pager.list){
                result.push((function(){
                    var itemID = pager.list[i].id;
                    return function(callback){
                        queues.send.pending.query(itemID, callback);
                    };
                })());
            };
            $.nodejs.async.parallel(result, callback);
        });

        $.nodejs.async.waterfall(workflow, function(err, result){
            var output;
            if(null != err){
                output = Error('错误：无法连接到数据中心。');
                return callback(err, output);
            };
            
            callback(null, {
                pager: pager,
                items: result,
            });
        });
    };
};
