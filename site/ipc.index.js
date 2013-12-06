module.exports = function(e, matchResult, rueckruf){
    e.response.writeHead(200);
    e.response.end(
          'Here is reception of the Kernel. Human should not have a chance to'
        + ' read this message. This IPC Server should be only accessible to'
        + ' the send/receive device via a hardware proxy or alike, or to the'
        + ' developers. The limited feature of this access, is providing an'
        + ' API to inject and retrive ciphertext, codebook-exchange-letter,'
        + ' and to inject the tunnel-offer-list.'
    );

    rueckruf(null);
};
