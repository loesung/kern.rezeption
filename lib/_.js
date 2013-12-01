_ = new function(){
    var self = this;

    this.format = require('./format.js')($, this);
    this.queue = require('./queue.js')($, this);
};
