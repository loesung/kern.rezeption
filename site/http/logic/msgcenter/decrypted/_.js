var handlers = {
    listQueue: require('./page.msgcenter.decrypted.listqueue.js'),
    process: require('./page.msgcenter.decrypted.process.js'),
};


module.exports = function(queues, parameter, action, post, respond){
    if($.types.isString(action)){
        handlers.process(queues, parameter, post, respond, action);
    } else {
        handlers.listQueue(queues, parameter, post, respond);
    };
};
