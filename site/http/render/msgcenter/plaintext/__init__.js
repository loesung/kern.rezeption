var router = $.net.urlRouter();
module.exports = router;

var tableDrawer = require('../table.js'),
    akashicForm = require('../akashic.js');

router
    .handle('', require('./_.js')(tableDrawer))
    .handle('process', require('./process.js')(akashicForm))
;

