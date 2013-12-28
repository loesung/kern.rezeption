module.exports = function(){
    return function(data, callback){
        var password = data.post.password,
            redirect = data.get.redirect;
        _.password.deletePassword('geheimdienst');

        if(undefined == redirect){
            redirect = '/';
        };

        if(undefined != password){
            _.password.setPassword(
                'geheimdienst',
                new $.nodejs.buffer.Buffer(password),
                CONFIG.get('password-cache-time')
            );
            callback(302, redirect);
        };

        callback(null, {
            redirect: redirect
        });
    };
};
