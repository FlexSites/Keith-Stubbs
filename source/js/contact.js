/* jshint jquery:true */

$(function(){
  var isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    , $requiredMessage = $('#requiredMessage');

  $('#contact-form').on('submit', function(){
    var valid = true
      , form = ['name','phone','email','message'].reduce(function(prev, curr){
      var $el = $('#'+curr)
        , val = $.trim($el.val());
      if(($el.attr('type') === 'email' && !isEmail.test(val)) || ($el.prop('required') && !val.length)) valid = false;
      if(!valid){
        handleError($el);
      }
      prev[curr] = val;
      return prev;
    },{});

    if(!valid) return;
    $.ajax({
      url: 'http://<<env>>api.flexhub.io/contactMessages',
      dataType: 'json',
      method: 'POST',
      data: form,
      success: function() {
        $requiredMessage.hide();
        $('#messageForm').hide();
        $('#messageConfirm').text('Thanks! Your message is on it\'s way!').show();
      }
    });
  });

  function handleError($el){
    $el.addClass('background-red').focus();
    $('#requiredMessage').show();
  }
});


