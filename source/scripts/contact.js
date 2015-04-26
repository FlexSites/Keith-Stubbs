
  $('#sendButton').on('click', function(){
    var name2 = $('#name').val();
    var phone2 = $('#phone').val();
    var email2 = $('#email').val();
    var message2 = $('#message').val();
    var valid = true;
    var re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if ($.trim(message2).length === 0) {
      valid = false;
      $('#message').css('background-color','#fcc');
      $('#requiredMessage').show();
      $("#message").focus();
    }
    if (!re.test(email2)) {
      valid = false;
      $('#email').css('background-color','#fcc');
      $('#requiredMessage').show();
      $("#email").focus();
    }
    if ($.trim(name2).length === 0) {
      valid = false;
      $('#name').css('background-color','#fcc');
      $('#requiredMessage').show();
      $("#name").focus();
    }

    if(valid){
      $('#requiredMessage').hide();
      $.ajax({
        url: 'http://localapi.flexhub.io/contactMessages',
        dataType: 'json',
        method: 'POST',
        data: {name: name2, phone:phone2, email:email2,message:message2},
        success: function(data) {
          console.log('data' + data)
          $('#messageForm').hide()
          $('#messageConfirm').html("Thanks! Your message is on it's way!")
        }
      });
    }
  })

