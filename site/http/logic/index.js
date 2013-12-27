module.exports = function(){
    return function(data, callback){
        var cpuInfo = $.nodejs.os.cpus();
        var cpuCounter = {};
        var cpuOutput = [];
        for(var i in cpuInfo)
            if(undefined == cpuCounter[cpuInfo[i].model])
                cpuCounter[cpuInfo[i].model] = 1;
            else
                cpuCounter[cpuInfo[i].model] += 1;
        for(var i in cpuCounter)
            cpuOutput.push([i, cpuCounter[i]]);



        callback(null, {
            memory: {
                free: $.nodejs.os.freemem(),
                total: $.nodejs.os.totalmem(),
            },
            cpu: cpuOutput,
            os: {
                type: $.nodejs.os.type(),
                arch: process.arch,
                release: $.nodejs.os.release(),
                uptime: $.nodejs.os.uptime,
            },
            version: {
                v8: process.versions.v8,
                node: process.versions.node,
                openssl: process.versions.openssl,
                zlib: process.versions.zlib,
            },
        });
    };
};
