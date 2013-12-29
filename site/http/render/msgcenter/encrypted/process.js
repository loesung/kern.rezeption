module.exports = function(toolkit){
    return function(data){
        var ret = '' ;

        if('remove' == data.type){
            ret = toolkit.deleteConfirm('encrypted')(data);
        };

        return ret;
    };
};
