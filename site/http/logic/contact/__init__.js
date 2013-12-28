var router = $.net.urlRouter();
var identity = _.identity(IPC['geheimdienst']);

router
    .handle('', require('./get.js')(identity))
    .handle('add', require('./add.js')(identity))
    .handle('detail', require('./detail.js')(identity))
    .handle('remove', require('./remove.js')(identity))
;

module.exports = router;
