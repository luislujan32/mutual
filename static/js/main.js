let clientTable

$().ready(() => {
  $('[data-toggle="tooltip"]').on().tooltip()

  loadTable()

  $('.saveForm').click(e => {
    e.preventDefault()
    const params = {
      url: '/v0/clientes',
      method: 'PUT',
      action: 'create'
    }
    sendFormCreateUpdate(params)
  })

  $('.saveFormUpdate').click(() => {
    const id = $('.saveFormUpdate').attr('idCustomer')
    const params = {
      url: `/v0/clientes/${id}`,
      method: 'POST',
      action: 'update'
    }
    sendFormCreateUpdate(params)
  })

  $('#add-cliente').click(() => {
    clearForm()
    $('#update-client-spinner').addClass('d-none')
    $('#formSaveClient').removeClass('d-none')
    $('#input-add-client-action').attr('action', 'create')
    $('.saveFormUpdate').addClass('d-none')
    $('.saveForm').removeClass('d-none')
    $('#add-cliente-title').html('Añadir cliente')
    $('#modal-add-cliente').modal('show')
  })

  $('#clients_table tbody').on('click', '.delete-client', function () {
    const id = clientTable.row($(this).parents('tr')).data()._id
    const url = '/v0/clientes'
    const method = 'delete'
    Swal.fire({
      title: 'Eliminar cliente',
      text: 'Esta acción no se podrá deshacer, ¿continuar?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: 'rgb(150, 141, 141)',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return fetch(url,
          {
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id}),
            cache: 'no-cache'
          })
          .then(response => {
            if (response.status === 200) {
              confirmDeleteUser()
              loadTable()
            } else {
              errorDeleteUser(response.statusText)
            }
          })
          .catch(err => {
            errorDeleteUser(err)
          })
      }
    })
  })

  $('#clients_table tbody').on('click', '.edit-client', function () {
    $('#update-client-spinner').removeClass('d-none')
    $('#formSaveClient').addClass('d-none')
    $('#input-add-client-action').attr('action', 'update')
    $('.saveForm').addClass('d-none')
    $('.saveFormUpdate').removeClass('d-none')
    $('.saveFormUpdate').addClass('disabled')
    $('#add-cliente-title').html('Modificar cliente')
    $('#modal-add-cliente').modal('show')

    const id = clientTable.row($(this).parents('tr')).data()._id
    $.ajax({
      url: `/v0/clientes/${id}`,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'GET',
      success: result => {
        $('#update-client-spinner').addClass('d-none')
        $('#formSaveClient').removeClass('d-none')
        $('.saveFormUpdate').removeClass('disabled')
        $('.saveFormUpdate').attr('idCustomer', id)
        clearForm()
        const client = result.clientes

        if (client.name) {
          $('#client-name').val(client.name)
        }
        if (client.lastname) {
          $('#client-lastname').val(client.lastname)
        }
        if (client.dni) {
          $('#client-dni').val(client.dni)
        }
        if (client.email) {
          $('#client-email').val(client.email)
        }
        if (client.address) {
          $('#client-address').val(client.address)
        }
        if (client.phone) {
          $('#client-phone').val(client.phone)
        }
        if (client.cellphone) {
          $('#client-cellphone').val(client.cellphone)
        }
        if (client.responsable) {
          $('#client-responsable').val(client.responsable)
        }
        if (client.degree) {
          $('#client-degree').val(client.degree)
        }
      },
      error: err => {
        console.log(err)
      },
      beforeSend: () => {

      },
      complete: () => {

      }
    })
  })

  $('#clients_table tbody').on('click', '.client-add-factura', function () {
    const name = clientTable.row($(this).parents('tr')).data().name + ' ' + clientTable.row($(this).parents('tr')).data().lastname
    $('.txtFacturaName').html(`Añadir una factura para el cliente <strong>${name}</strong>`)
    $('#modal-add-factura').modal('show')
  })
})

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACTIONS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

function sendFormCreateUpdate(params) {
  const validatedForm = validateForm()
  if (validatedForm.result === 'error') {
    if ($('.form-not-valid-alert').length === 0) {
      $('#formSaveClient').prepend('<div class="alert alert-danger form-not-valid-alert" role="alert">Los campos marcados en rojo son obligatorios. </div>')
    }
    return false
  }
  $('.form-not-valid-alert').remove()
  const formData = JSON.stringify(validatedForm.obj)
  $.ajax({
    url: params.url,
    dataType: 'json',
    contentType: 'application/json;charset=UTF-8',
    type: params.method,
    data: formData,
    success: result => {
      $('#modal-add-cliente').modal('toggle')
      let auxTitleAction
      let auxTextAction
      if (params.action === 'create') {
        auxTitleAction = 'Añadir'
        auxTextAction = 'añadido'
      } else if (params.action === 'update') {
        auxTitleAction = 'Modificar'
        auxTextAction = 'modificado'
      }
      Swal.fire({
        icon: 'success',
        title: `${auxTitleAction} cliente`,
        html: `<p>El cliente se ha ${auxTextAction} satisfactoriamente!</p>`
      })
      clearForm()
      loadTable()
    },
    error: err => {
      if (err.status === 422) {
        const listErrors = err.responseJSON.errors.result.errors
        if ($('.form-not-valid-alert').length === 0) {
          $('#formSaveClient').prepend('<div class="alert alert-danger form-not-valid-alert" role="alert">Los campos marcados en rojo son obligatorios. </div>')
        }
        listErrors.forEach(element => {
          if (element.field === 'name') {
            $('#client-name').addClass('input-error')
          }
          if (element.field === 'lastname') {
            $('#client-lastname').addClass('input-error')
          }
          if (element.field === 'dni') {
            $('#client-dni').addClass('input-error')
          }
          if (element.field === 'responsable') {
            $('#client-responsable').addClass('input-error')
          }
          if (element.field === 'cellphone') {
            $('#client-cellphone').addClass('input-error')
          }
          if (element.field === 'degree') {
            $('#client-degree').addClass('input-error')
          }
        })
      }
    },
    beforeSend: () => {
      if (params.action === 'create') {
        $('.saveForm').addClass('disabled')
        $('.saveForm .text').text('Procesando...')
        hideCardsData()
      } else if (params.action === 'update') {
        $('.saveFormUpdate').addClass('disabled')
        $('.saveFormUpdate .text').text('Procesando...')
      }
    },
    complete: () => {
      if (params.action === 'create') {
        $('.saveForm').removeClass('disabled')
        $('.saveForm .text').text('Guardar')
      } else if (params.action === 'update') {
        $('.saveFormUpdate').removeClass('disabled')
        $('.saveFormUpdate .text').text('Modificar')
      }
    }
  })
}

function confirmDeleteUser() {
  Swal.fire({
    icon: 'success',
    title: 'Usuario borrado con éxito'
  })
}

function errorDeleteUser(text) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: `No se pudo eliminar!, Mensaje: ${text}`
  })
}

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FORMS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

function validateForm() {
  const obj = {}

  $(':input').removeClass('input-error')

  obj.name = $('#client-name').val()
  if (!obj.name) {
    $('#client-name').addClass('input-error')
  }
  obj.lastname = $('#client-lastname').val()
  if (!obj.lastname) {
    $('#client-lastname').addClass('input-error')
  }
  obj.dni = $('#client-dni').val()
  if (!obj.dni) {
    $('#client-dni').addClass('input-error')
  }
  obj.cellphone = $('#client-cellphone').val()
  if (!obj.cellphone) {
    $('#client-cellphone').addClass('input-error')
  }
  obj.responsable = $('#client-responsable').val()
  if (!obj.responsable) {
    $('#client-responsable').addClass('input-error')
  }
  obj.degree = $('#client-degree').val()
  if (obj.degree === '') {
    $('#client-degree').addClass('input-error')
  }
  obj.email = $('#client-email').val()
  obj.address = $('#client-address').val()
  obj.phone = $('#client-phone').val()

  const countErrors = $('.input-error')
  if (countErrors.length > 0) {
    return {result: 'error'}
  }

  return {result: 'success', obj}
}

function clearForm() {
  const form = document.getElementById('formSaveClient')
  form.reset()
  $(':input').removeClass('input-error')
  $('.form-not-valid-alert').remove()
}

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TABLES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

function loadTable() {
  $.ajax({
    url: '/v0/clientes',
    dataType: 'json',
    type: 'GET',
    success: result => {
      createTable(result.result.clientes)
      loadCardsData(result.result)
    },
    error: err => {
      console.log(err)
    },
    beforeSend: () => {
      $('#tableClientsSpinner').removeClass('d-none')
      $('.divTableClients').addClass('d-none')
    },
    complete: () => {
      $('#tableClientsSpinner').addClass('d-none')
      $('.divTableClients').removeClass('d-none')
    }
  })
}

function createTable(dataSet) {
  $('#clients_table').dataTable().fnDestroy()
  clientTable = $('#clients_table').DataTable({
    data: dataSet,
    columns: [
      {data: '_id'},
      {data: 'lastname'},
      {data: 'name'},
      {data: 'degree'},
      {data: 'saldo'},
      {data: null}
    ],
    columnDefs: [
      {
        targets: [0],
        visible: false
      },
      {
        targets: [5],
        visible: false
      },
      {
        targets: [6],
        data: null,
        defaultContent: '<button type="button" class="btn btn-default edit-client" data-toggle="tooltip" data-placement="top" title="Editar" ><i class="fa fa-edit"></i></button>' +
                        '<button type="button" class="btn btn-default delete-client"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="Eliminar"></i></button>' +
                        '<button type="button" class="btn btn-default client-add-factura"><i class="fas fa-dollar-sign" data-toggle="tooltip" data-placement="top" title="Factura"></i></button>' +
                        '<button type="button" class="btn btn-default client-add-recibo"><i class="fas fa-coins" data-toggle="tooltip" data-placement="top" title="Recibo"></i></button>' +
                        '<button type="button" class="btn btn-default details-client"><i class="fas fa-file-invoice-dollar" data-toggle="tooltip" data-placement="top" title="Detalles"></i></button>'
      }
    ],
    language: {
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

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  CARDS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

function loadCardsData(data) {
  // Total clientes
  $('#spinnerCardTotalClients').addClass('d-none')
  $('#cardTotalClients').removeClass('d-none')
  $('#cardTotalClients').text(data.total)
}

function hideCardsData() {
  // Total clientes
  $('#spinnerCardTotalClients').removeClass('d-none')
  $('#cardTotalClients').addClass('d-none')
  $('#cardTotalClients').text('-')
}
