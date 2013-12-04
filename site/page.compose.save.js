module.exports = function(post, callback){
    $.global.set('compose', post.parsed.content);
    
    callback(null, ('saved'
    ));
};
