module.exports = function(tableDrawer){
    return function(data){
        var drawer = tableDrawer(
            'plaintext'
        );

        return drawer(data);
    };
};
