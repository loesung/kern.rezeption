var router = $.net.urlRouter();
module.exports = router;

router
    .handle('', require('./_.js')())
;
