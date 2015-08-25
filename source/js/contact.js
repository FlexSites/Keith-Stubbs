/* jshint jquery:true */

$(function(){
  var isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    , $requiredMessage = $('#requiredMessage');

  $('#contact-form').on('submit', function(){
    var valid = true
      , form = ['name','phone','fromEmail','body','toEmail', 'type'].reduce(function(prev, curr){
      var $el = $('#'+curr)
        , val = $.trim($el.val());
      if(($el.attr('type') === 'fromEmail' && !isEmail.test(val)) || ($el.prop('required') && !val.length)){
        handleError($el);
        valid = false;
      }
      prev[curr] = val;
      return prev;
    },{});

    if(!valid) return;
    $.ajax({
      url: '/api/v1/contact-messages',
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

  var $testimonials = $('.testimonial');

  var idx = 0;
  function setActive(){
    $('.testimonial_-active').removeClass('testimonial_-active');
    if(idx >= $testimonials.length) idx = 0;
    $testimonials.eq(idx++).addClass('testimonial_-active');
    return setActive;
  }

  setInterval(setActive(), 7500);
});


