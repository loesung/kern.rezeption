module.exports = function(tableDrawer){
    return function(data){
        var drawer = tableDrawer(
            'decrypted'
        );

        return drawer(data);
    };
};
