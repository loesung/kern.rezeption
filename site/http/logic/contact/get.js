function getList(json, showPage){
    // TODO use _.pager to do this.
    var list = [];

    for(var i in json)
        list.push(json[i]);

    list.sort(function(a,b){
        return ((a.name < b.name)?1:-1);
    });

    var perPage = 10,
        maxPage = Math.ceil(list.length / perPage);

    if(isNaN(showPage))
        showPage = 1;
    else {
        showPage = Math.floor(showPage);
        if(showPage < 1) showPage = 1;
        if(showPage > maxPage) showPage = maxPage;
    }

    return list;
};

module.exports = function(identity){
    return function(data, callback){
        var page = data.get.page;

        $.nodejs.async.waterfall([
            identity.list,

            function(json, callback){
                callback(null, getList(json, page));
            },

        ], function(err, result){   
            if(null == err) return callback(null, result);
            if(401 == err)
                return callback(
                    302,
                    '/authenticate?' + $.nodejs.querystring.stringify({
                        'redirect': '/contact/?_=' + process.hrtime()[1],
                    })
                );
            callback(null, Error('cannot-connect-to-geheimdienst'));
        });
    };
};
