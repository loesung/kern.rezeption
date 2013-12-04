module.exports = function($, _){
    return new function(){
        var self = this;

        this.seconds2Human = function(seconds){
            seconds = Math.round(seconds);

            if(seconds < 60)
                return seconds + '秒';
            
            var min = Math.floor(seconds / 60);
            if(min < 60)
                return min + '分钟';

            var hr = Math.floor(min / 60);
            min = min % 60;
            if(hr < 24)
                return hr + '小时' + min + '分钟';

            var day = Math.floor(hr / 24);
            hr = hr % 24;
            return day + '天' + hr + '小时' + min + '分钟';
        };

        this.bytes2Human = function(bytes){
            if(bytes < 1024)
                return bytes + 'Byte';

            var kB = Math.floor(bytes / 10.24) / 100;
            if(kB < 1024)
                return kB + 'kByte';

            var MB = Math.floor(kB / 10.24) / 100;
            if(MB < 1024)
                return MB + 'MByte';

            var GB = Math.floor(MB / 10.24) / 100;
            if(GB < 1024)
                return GB + 'GByte';

            var TB = Math.floor(GB / 10.24) / 100;
            return TB + 'TByte';
        };

        this.time2Full = function(date){
            if(undefined == date) date = new Date();
            function paddingZero(input){
                if(input < 10)
                    return '0' + String(input);
                else
                    return String(input);
            };
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minutes = date.getMinutes(),
                seconds = date.getSeconds();
            return year + '-' + paddingZero(month) + '-' + paddingZero(day)
                + ' ' + paddingZero(hour) + ':' + paddingZero(minutes)
                + ':' + paddingZero(seconds);
        };
    };
};
