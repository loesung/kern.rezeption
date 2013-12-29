module.exports = function(toolkit){
    return function(data){
        var drawer = toolkit.tableDrawer(
            'plaintext'
        );

        return drawer(data);
    };
};
