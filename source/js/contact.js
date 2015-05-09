/* jshint jquery:true */

$(function(){
  var isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    , $requiredMessage = $('#requiredMessage');

  $('#contact-form').on('submit', function(){
    var valid = true
      , form = ['name','phone','email','body'].reduce(function(prev, curr){
      var $el = $('#'+curr)
        , val = $.trim($el.val());
      if(($el.attr('type') === 'email' && !isEmail.test(val)) || ($el.prop('required') && !val.length)){
        handleError($el);
        valid = false;
      }
      prev[curr] = val;
      return prev;
    },{});

    if(!valid) return;
    $.ajax({
      url: 'http://v2.flexhub.io/contactMessages',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      method: 'POST',
      data: JSON.stringify(form),
      success: function() {
        $requiredMessage.hide();
        $('#contact-form').hide();
        $('#message-confirm').text('Thanks! Your message is on it\'s way!').show();
      },
      error: function(){
        // TODO: Handle error case
      }
    });
    return false;
  });

  function handleError($el){
    $el.addClass('background-red').focus();
    $('#requiredMessage').show();
    event.preventDefault();
  }
});


