module.exports = function(tableDrawer){
    return function(data){
        var drawer = tableDrawer(
            'ciphertext'
        );

        return drawer(data);
    };
};
