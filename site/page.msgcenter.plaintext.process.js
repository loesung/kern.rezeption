module.exports = function(queues, parameter, post, respond, urlcommand){
    function backToIndex(){
        respond(302, '/msgcenter/plaintext');
    };
    var isID = /^[0-9a-f]{8}\-([0-9a-f]{4}\-){3}[0-9a-f]{12}$/i;

    /* Determine objects being operated
     * - if by post, read posted body.
     * - read parameter
     * Anyway, use isID.test() to filter all id.
     */
    var objectIDs = [];
    if(isID.test(parameter)) objectIDs.push(parameter.toLowerCase());
    if($.types.isObject(post)){
        for(var key in post.parsed){
            if(isID.test(post.parsed[key]))
                objectIDs.push(post.parsed[key].toLowerCase());
        };
    };
    if(objectIDs.length < 1) return backToIndex();

    /* Determine action: send, or remove */
    var action = 'send';
    if($.types.isObject(post))
        if('remove' == post.parsed['do']) action = 'remove';

    /* Determine desired sending method */
    var via = urlcommand;
    if('do' == via) via = post.parsed['send'];
    if(!/^(passphrase|codebook|sign)$/i.test(via)) return backToIndex();
    

    console.log(objectIDs, action, via, '**');
    respond(null, 'Hallo');
};
