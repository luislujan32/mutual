$().ready(() => {
  loadTable()

  $('.saveForm').click(event => {
    const validatedForm = validateForm()
    if (validatedForm.result === 'error') {
      showErrorsInForm()
      return false
    }
    $('.form-not-valid-alert').remove()
    const formData = JSON.stringify(validatedForm.obj)

    $.ajax({
      url: '/v0/clientes',
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'PUT',
      data: formData,
      success: result => {
        $('#add-cliente').modal('toggle')
        swal('Añadir cliente', 'El cliente se ha añadido satisfactoriamente!', 'success')
        clearForm()
        loadTable()
      },
      error: err => {
        console.log(err)
      },
      beforeSend: () => {
        $('.saveForm').attr('disabled', 'disabled')
        $('.saveForm .text').text('Procesando...')
      },
      complete: () => {
        $('.saveForm').removeAttr('disabled')
        $('.saveForm .text').text('Guardar')
      }
    })
  })
})

function validateForm() {
  const obj = {}
  const hasErrors = false

  const form = document.getElementById('formSaveClient')
  if (form.checkValidity() === false) {
    return {result: 'error'}
  }
  // Implementar validacion de campos
  obj.name = $('#client-name').val()
  obj.lastname = $('#client-lastname').val()
  obj.dni = $('#client-dni').val()
  obj.email = $('#client-email').val()
  obj.address = $('#client-address').val()
  obj.phone = $('#client-phone').val()
  obj.cellphone = $('#client-cellphone').val()
  obj.responsable = $('#client-responsable').val()
  obj.degree = $('#client-degree').val()

  if (hasErrors) {
    return {result: 'error'}
  }
  return {result: 'success', obj}
}

function showErrorsInForm() {
  $('#formSaveClient').addClass('was-validated')
  if ($('.form-not-valid-alert').length === 0) {
    $('#formSaveClient').prepend('<div class="alert alert-danger form-not-valid-alert" role="alert">Los campos marcados en rojo son obligatorios. </div>')
  }
}

function clearForm() {
  const form = document.getElementById('formSaveClient')
  form.reset()
  $(form).removeClass('was-validated')
  $('.form-not-valid-alert').remove()
}

function loadTable() {
  $.ajax({
    url: '/v0/clientes',
    dataType: 'json',
    type: 'GET',
    success: result => {
      createTable(result.result)
    },
    error: err => {
      console.log(err)
    },
    beforeSend: () => {
      $('#tableClientsSpinner').removeClass('invisible')
      $('.divTableClients').addClass('invisible')
    },
    complete: () => {
      $('#tableClientsSpinner').addClass('invisible')
      $('.divTableClients').removeClass('invisible')
    }
  })
}

function createTable(dataSet) {
  $('#clients_table').dataTable().fnDestroy()
  $('#clients_table').dataTable({
    aaData: dataSet,
    aoColumns: [
      {mData: '_id', visible: false, bSearchable: false},
      {mData: 'name'},
      {mData: 'lastname'},
      {mData: 'degree'}
    ],
    oLanguage: {
      sProcessing: 'Procesando...',
      sLengthMenu: '_MENU_ registros',
      sZeroRecords: 'No se encontraron resultados',
      sEmptyTable: 'Ningún dato disponible en esta tabla',
      sInfo: '_START_-_END_ de _TOTAL_',
      sInfoEmpty: '0-0 de 0',
      sInfoFiltered: '(filtrado de un total de _MAX_ registros)',
      sInfoPostFix: '',
      sSearch: 'Buscar:',
      sUrl: '',
      sInfoThousands: ',',
      sLoadingRecords: 'Cargando...',
      oPaginate: {
        sFirst: '<i class=\'fa fa-angle-double-left\'></i>',
        sLast: '<i class=\'fa fa-angle-double-right\'></i>',
        sNext: '<i class=\'fa fa-angle-right\'></i>',
        sPrevious: '<i class=\'fa fa-angle-left\'></i>'
      },
      oAria: {
        sSortAscending: ': Activar para ordenar la columna de manera ascendente',
        sSortDescending: ': Activar para ordenar la columna de manera descendente'
      }
    }
  })
}

