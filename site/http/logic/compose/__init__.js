var router = $.net.urlRouter();
module.exports = router;

var queues = _.queue(IPC['datenbank']);

router
    .handle('write', require('./write.js')(queues))
    .handle('save', require('./save.js')(queues))
;
