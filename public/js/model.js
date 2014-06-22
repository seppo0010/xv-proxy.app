var Proxy = require('xv-proxy');

var proxy = {
   proxy: new Proxy(),
   port: 8080,
   domain: '0.0.0.0',
   running: false,

   start: function(cb) {
      var self = this;
      if (this.running) {
         this.stop(function() {
            self.start(cb);
         });
      } else {
         this.proxy.listen(this.port, this.domain, function() {
            self.running = true;
            if (cb) {
               cb();
            }
         });
      }
   },
   stop: function(cb) {
      if (this.running) {
         var self = this;
         this.proxy.close(function() {
            self.running = false;
            if (cb) {
               cb();
            }
         });
      }
   },

   set_port: function(port, cb) {
      this.port = port;
      if (this.running) {
         this.start(cb);
      }
   },
   set_domain: function(domain, cb) {
      this.domain = domain;
      if (this.running) {
         this.start(cb);
      }
   }
};
