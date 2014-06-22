$(document).on('click', 'input[type=checkbox]', function(ev) {
   var obj = $(ev.currentTarget);
   var checked = obj.is(':checked');

   obj.addClass('csspinner');
   var cb = function() { obj.removeClass('csspinner'); };

   switch (obj.attr('name')) {
      case 'enabled':
         if (checked) {
            proxy.start(cb);
         } else {
            proxy.stop(cb);
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
      case 'port':
         proxy.set_port(parseInt(value, 10), cb);
         break;
   }
});
