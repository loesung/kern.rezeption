module.exports = function($, _){
    return function(list, perpage, current){
        return new function(){
            var self = this;
            maxPage = Math.ceil(list.length / perpage);
            if(isNaN(current))
                current = 1;
            else{
                current = Math.round(current);
                if(current > maxPage) current = maxPage;
                if(current < 1) current = 1;
            };

            list = list.slice(
                (current - 1) * perpage, current * perpage 
            );

            this.list = list;
            this.current = current;
            this.max = maxPage;
            
            this.navigateBar = function(linkGen){
                if(1 == maxPage) return '';

                var reserve = 3;
                var html = [];

                var travelBegin = current - reserve,
                    travelEnd = current + reserve,
                    frontOmit = false,
                    endOmit = false;

                html.push(linkGen(1, (1 == current)));

                if(travelBegin <= 2)
                    travelBegin = 2;
                else
                    frontOmit = true;

                if(travelEnd >= maxPage - 1)
                    travelEnd = maxPage - 1;
                else
                    endOmit = true;

                if(frontOmit) html.push('...');

                for(var i = travelBegin; i <= travelEnd; i++){
                    html.push(
                        linkGen(i, (i == current))
                    );
                };

                if(endOmit) html.push('...');

                html.push(linkGen(maxPage, (maxPage == current)));

                return html.join(' ');
            };
        };
    };
};
