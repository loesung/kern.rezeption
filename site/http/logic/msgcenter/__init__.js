var router = $.net.urlRouter();

var queues = _.queue(IPC['datenbank']);

router
    .handle('', require('./_.js')(queues))
    
    .sub('ciphertext', require('./ciphertext/__init__.js'))
    .sub('plaintext', require('./plaintext/__init__.js'))
    .sub('encrypted', require('./encrypted/__init__.js'))
    .sub('decrypted', require('./decrypted/__init__.js'))
;

module.exports = router; 
