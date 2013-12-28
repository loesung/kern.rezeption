module.exports = function($, _){
    return (function(){
        var self = this;

        storage = {};

        this.setPassword = function(name, value, life){
            storage[name] = {
                value: value,
                visit: new Date().getTime(),
                life: life * 1000,
            };
        };

        this.getPassword = function(name){
            if(undefined != storage[name]){
                storage[name].visit = new Date().getTime();
                return storage[name].value;
            } else
                return false;
        };

        this.deletePassword = function(name){
            if(undefined != storage[name]) delete storage[name];
        };

        this.deleteAllPassword = function(){
            storage = {};
        };

        function refreshStatus(){
            var delList = [], now = new Date().getTime();
            for(var i in storage)
                if(storage[i].visit + storage[i].life < now)
                    delList.push(i);
            for(var i in delList)
                delete storage[i];
            setTimeout(refreshStatus, 300);
        };

        refreshStatus();

        return this;
    })();
};
