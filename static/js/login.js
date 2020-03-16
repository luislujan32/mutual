
$().ready(() => {
  $('#login').click(() => {
    const email = $('#email').val()
    const pass = $('#password').val()

    if (!email || !pass) {
      $('#error-alert').removeClass('invisible')
      return false
    }

    $.ajax({
      type: 'POST',
      url: '/v0/login',
      data: {email, pass},
      dataType: 'json',
      success: result => {
        if (result.result === 'success') {
          window.location.href = '/v0/main'
        }
      },
      error: () => {
        $('#error-alert').removeClass('invisible')
      },
      beforeSend: () => {
        $('#error-alert').addClass('invisible')
      }
    })
  })
})
