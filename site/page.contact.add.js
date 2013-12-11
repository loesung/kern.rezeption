module.exports = function(identity, post, callback){
    console.log(post);

    $.nodejs.async.waterfall([
        identity.list,

        function(json, callback){
            callback(null, 'I\'m working on it.');
        },

    ], callback);
};
