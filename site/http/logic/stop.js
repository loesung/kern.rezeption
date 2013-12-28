module.exports = function(){
    return function(data, callback){
        _.password.deleteAllPassword();
        $.global.set('compose', '');
        callback(302, '/');
    };
};
