module.exports = function(toolkit){
    return function(data){
        var drawer = toolkit.tableDrawer(
            'encrypted'
        );

        return drawer(data);
    };
};
