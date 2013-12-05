var handlers = {
    listQueue: require('./page.msgcenter.plaintext.listqueue.js'),
    process: require('./page.msgcenter.plaintext.process.js'),
};


module.exports = function(queues, parameter, action, post, respond){
    if('do' == action){
        handlers.process(queues, parameter, post, respond);
    } else {
        handlers.listQueue(queues, parameter, post, respond);
    };
};
