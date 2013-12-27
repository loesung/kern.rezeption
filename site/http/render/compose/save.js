module.exports = function(){
    return function(data, callback){
        callback(null, JSON.stringify(data));
    };
};
