var EventEmitter = require('events').EventEmitter;
var util = require('util');

var XVProxy = require('xv-proxy');
var MemoryRecorder = require('xv-proxy/lib/recorder/memory');

var Proxy = function(options) {
  options = options || {};
  EventEmitter.call(this);
  this.proxy = new XVProxy();
  this.port = options.port || 8080;
  this.domain = options.domain || '0.0.0.0';
  this.running = false;
  this.recording = null;
};
util.inherits(Proxy, EventEmitter);

Proxy.prototype.start = function(cb) {
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
};
Proxy.prototype.stop = function(cb) {
  if (this.running) {
    var self = this;
    this.proxy.close(function() {
      self.running = false;
      if (cb) {
        cb();
      }
    });
  }
};

Proxy.prototype.set_port = function(port, cb) {
  this.port = port;
  if (this.running) {
    this.start(cb);
  }
};

Proxy.prototype.set_domain = function(domain, cb) {
  this.domain = domain;
  if (this.running) {
    this.start(cb);
  }
};

Proxy.prototype.start_recording = function(cb) {
  if (this.recording) {
    return;
  }
  var recorder = new MemoryRecorder({});
  var self = this;
  recorder.on('request:end', function(request) {
    self.emit('requests:add', request);
  });
  recorder.list_requests(function(err, requests) {
    if (err) {
      throw err;
      return;
    }
    self.emit('requests:initial', requests);
  });
  this.recording = [
    recorder.request.bind(recorder),
    recorder.response.bind(recorder)
  ];
  this.proxy.addRequestPipeFactory(this.recording[0]);
  this.proxy.addResponsePipeFactory(this.recording[1]);
  cb();
};

Proxy.prototype.stop_recording = function(cb) {
  this.proxy.removeRequestPipeFactory(this.recording[0]);
  this.proxy.removeResponsePipeFactory(this.recording[1]);
  this.recording = null;
  cb();
};
var proxy = new Proxy();
