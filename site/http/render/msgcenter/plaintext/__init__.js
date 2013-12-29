var router = $.net.urlRouter();
module.exports = router;

var toolkit = require('../toolkit.js')();

router
    .handle('', require('./_.js')(toolkit))
    .handle('process', require('./process.js')(toolkit))
;

