$(document).on('click', 'input[type=checkbox]', function(ev) {
  var obj = $(ev.currentTarget);
  var checked = obj.is(':checked');

  obj.addClass('csspinner');
  var cb = function() { obj.removeClass('csspinner'); };

  switch (obj.attr('name')) {
    case 'proxy.enabled':
      if (checked) {
        proxy.start(cb);
      } else {
        proxy.stop(cb);
      }
      break;
    case 'recording.enabled':
      if (checked) {
        proxy.start_recording(cb);
      } else {
        proxy.stop_recording(cb);
      }
      break;
  }
});

$(document).on('change', 'input[type=text]', function(ev) {
  var obj = $(ev.currentTarget);
  var value = obj.val();

  obj.addClass('csspinner');
  var cb = function() { obj.removeClass('csspinner'); };

  switch (obj.attr('name')) {
    case 'proxy.port':
      proxy.set_port(parseInt(value, 10), cb);
      break;
  }
});

var keys = ['url', 'method', 'status', 'duration', 'latency',
    'start_time', 'end_time'];
var requestById = {};
var format_request = function(r) {
  return {
      id: r.id,
      url: r.url,
      method: r.method,
      status: r.status,
      duration: r.response_end ? r.response_end - r.request_start + 'ms' : '',
      latency: r.response_start ? r.response_start - r.request_end + 'ms' : '',
      start_time: r.request_start ? new Date(parseInt(r.request_start)).toISOString() : '',
      end_time: r.response_end ? new Date(parseInt(r.response_end)).toISOString() : ''
  };
};

proxy.on('requests:initial', function(data) {
  var options = {
      valueNames: keys
  };

  requestList = new List('requests', options);
  $.each(data, function(i, r) {
      requestById[r.id] = r;
      requestList.add(format_request(r));
  });
});

proxy.on('requests:add', function(r) {
  requestById[r.id] = r;
  requestList.add(format_request(r));
});

proxy.on('request:info', function(r) {
  if (r.id === currentHash) {
      var currentRequest = requestById[r.id];
      $('#request-data').html(
          _.template($('#request-data-template').html(),
              _.extend({}, r, currentRequest)));
  }
});
