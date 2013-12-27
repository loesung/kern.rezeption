var PER_PAGE = 8;
module.exports = function(queues){
    return function(data, rueckruf){
        var workflow = [];
        var pager = null;

        workflow.push(queues.receive.proceeded.list);

        workflow.push(function(list, callback){
            list.sort(function(a, b){
                return b.timestamp - a.timestamp;
            });

            pager = _.paging(list, PER_PAGE, 'decrypted');

            callback(null, pager);
        });

        workflow.push(function(list, callback){
            var result = [];
            for(var i in pager.list){
                result.push((function(itemID){
                    return function(callback){
                        queues.send.pending.query(itemID, callback);
                    };
                })(pager.list[i].id));
            };
            $.nodejs.async.series(result, callback);
        });

        $.nodejs.async.waterfall(workflow, function(err, result){
            var output;
            if(null != err){
                output = Error('错误：无法连接到数据中心。');
                return rueckruf(err, output);
            };

            rueckruf(null, {
                pager: pager,
                items: result,
            });
        });
    };
};
