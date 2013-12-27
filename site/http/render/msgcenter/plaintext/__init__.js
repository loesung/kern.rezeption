var router = $.net.urlRouter();
module.exports = router;

var tableDrawer = require('../table.js');

router
    .handle('', require('./_.js')(tableDrawer))
    .handle('process', require('./process.js')())
;

