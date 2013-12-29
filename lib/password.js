module.exports = function($, _){
    return (function(){
        var self = this;

        var storage = {};

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
            String("The stored password [" + name + "] is now deleted.")
                .NOTICE();
            if(undefined != storage[name]) delete storage[name];
        };

        this.deleteAllPassword = function(){
            String("All passwords stored in memory now deleted.").NOTICE();
            storage = {};
        };

        function refreshStatus(){
            var delList = [], now = new Date().getTime();
            for(var i in storage){
                if(storage[i].visit + storage[i].life < now)
                    delList.push(i);
            };
            for(var i in delList)
                self.deletePassword(delList[i]);
            setTimeout(refreshStatus, 300);
        };

        refreshStatus();

        return this;
    })();
};
