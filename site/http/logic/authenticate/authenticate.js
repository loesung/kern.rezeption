module.exports = function(){
    var geheimdienst = IPC['geheimdienst'];

    return function(data, callback){
        var password = data.post.password,
            redirect = data.get.redirect;
        _.password.deletePassword('geheimdienst');

        if(undefined == redirect){
            redirect = '/';
        };

        if(undefined != password){
            // check password by immediately verifying it at Geheimdienst.
            var workflow = [],
                bufferPassword = new $.nodejs.buffer.Buffer(password),
                allowCreate = (undefined != data.post.create);

            workflow.push(function(callback){
                geheimdienst.request(
                    '/',
                    callback,
                    {
                        auth: {
                            username: (allowCreate?'creator':'authenticator'),
                            password: bufferPassword.toString('hex'),
                        },
                    }
                );
            });

            workflow.push(function(packet, callback){
                callback(null, packet.response.statusCode);
            });

            $.nodejs.async.waterfall(workflow, function(err, statusCode){
                if(null == err){
                    if(200 == statusCode){
                        _.password.setPassword(
                            'geheimdienst',
                            bufferPassword,
                            CONFIG.get('password-cache-time')
                        );
                        return callback(302, redirect);
                    };
                    
                    if(404 == statusCode){
                        return callback(null, {
                            redirect: redirect,
                            create: true,
                        });
                    };
                };

                return callback(null, {
                    redirect: redirect,
                    failed: true,
                });
            });
        } else {
            callback(null, {
                redirect: redirect
            });
        };
    };
};
