var queues = _.queue(IPC['datenbank']);

var router = $.net.urlRouter();
module.exports = router;

router
    .handle('', require('./listqueue.js')(queues))
    .handle('process', require('./process.js')(queues))
;
