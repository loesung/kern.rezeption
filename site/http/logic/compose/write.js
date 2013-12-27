module.exports = function(queues){
    return function(data, callback){
        var saved = $.global.get('compose');
        callback(null, saved);
    };
};
