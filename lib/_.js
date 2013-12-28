_ = new function(){
    var self = this;

    this.format = require('./format.js')($, this);
    this.queue = require('./queue.js')($, this);
    this.identity = require('./identity.js')($, this);

    this.paging = require('./paging.js')($, this);

    this.botschaft = require('./botschaft.js')($, this);

    this.password = require('./password.js')($, this);
};
