module.exports = function(tableDrawer){
    return function(data){
        var drawer = tableDrawer(
            'encrypted'
        );

        return drawer(data);
    };
};
