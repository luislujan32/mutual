let productsTable

$().ready(() => {
  $('[data-toggle="tooltip"]').on().tooltip()

  loadTable()

  $('#add-producto').click(() => {
    clearForm()
    $('#update-product-spinner').addClass('d-none')
    $('#formSaveProduct').removeClass('d-none')
    $('#input-add-product-action').attr('action', 'create')
    $('.saveFormUpdate').addClass('d-none')
    $('.saveForm').removeClass('d-none')
    $('#add-product-title').html('Añadir producto')
    $('#modal-add-producto').modal('show')
  })

  $('.saveForm').click(e => {
    e.preventDefault()
    const params = {
      url: '/v0/productos',
      method: 'PUT',
      action: 'create'
    }
    sendFormCreateUpdate(params)
  })

  $('.saveFormUpdate').click(() => {
    const id = $('.saveFormUpdate').attr('idProduct')
    const params = {
      url: `/v0/productos/${id}`,
      method: 'POST',
      action: 'update'
    }
    sendFormCreateUpdate(params)
  })

  $('#products_table tbody').on('click', '.edit-product', function () {
    $('#update-product-spinner').removeClass('d-none')
    $('#formSaveProduct').addClass('d-none')
    $('#input-add-product-action').attr('action', 'update')
    $('.saveForm').addClass('d-none')
    $('.saveFormUpdate').removeClass('d-none')
    $('.saveFormUpdate').addClass('disabled')
    $('#add-product-title').html('Modificar producto')
    $('#modal-add-producto').modal('show')

    const id = productsTable.row($(this).parents('tr')).data()._id
    $.ajax({
      url: `/v0/productos/${id}`,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'GET',
      success: result => {
        $('#update-product-spinner').addClass('d-none')
        $('#formSaveProduct').removeClass('d-none')
        $('.saveFormUpdate').removeClass('disabled')
        $('.saveFormUpdate').attr('idProduct', id)
        clearForm()
        const producto = result.productos

        if (producto.name) {
          $('#product-name').val(producto.name)
        }
        if (producto.waist) {
          $('#producto-talle').val(producto.waist)
        }
        if (producto.stock) {
          $('#producto-stock').val(producto.stock)
        }
        if (producto.type) {
          $('#producto-type').val(producto.type)
        }
        if (producto.price) {
          $('#producto-precio').val(producto.price)
        }
        if (producto.description) {
          $('#producto-descripcion').val(producto.description)
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

  $('#products_table tbody').on('click', '.delete-product', function () {
    const id = productsTable.row($(this).parents('tr')).data()._id
    const url = '/v0/productos'
    const method = 'delete'
    Swal.fire({
      title: 'Eliminar producto',
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
              confirmDeleteProduct()
              loadTable()
            } else {
              errorDeleteProduct(response.statusText)
            }
          })
          .catch(err => {
            errorDeleteProduct(err)
          })
      }
    })
  })
})

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FORMS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

function clearForm() {
  const form = document.getElementById('formSaveProduct')
  form.reset()
  $(':input').removeClass('input-error')
  $('.form-not-valid-alert').remove()
}

function validateForm() {
  const obj = {}

  $(':input').removeClass('input-error')

  obj.name = $('#product-name').val()
  if (!obj.name) {
    $('#product-name').addClass('input-error')
  }
  obj.waist = $('#producto-talle').val()
  if (!obj.waist) {
    $('#producto-talle').addClass('input-error')
  }
  obj.stock = $('#producto-stock').val()
  if (!obj.stock) {
    $('#producto-stock').addClass('input-error')
  }
  obj.type = $('#producto-type').val()
  if (!obj.type) {
    $('#producto-type').addClass('input-error')
  }
  obj.price = $('#producto-precio').val()
  if (!obj.price) {
    $('#producto-precio').addClass('input-error')
  }
  obj.descript = $('#producto-descripcion').val()

  const countErrors = $('.input-error')
  if (countErrors.length > 0) {
    return {result: 'error'}
  }

  return {result: 'success', obj}
}

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACTIONS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

function sendFormCreateUpdate(params) {
  const validatedForm = validateForm()
  if (validatedForm.result === 'error') {
    if ($('.form-not-valid-alert').length === 0) {
      $('#formSaveProduct').prepend('<div class="alert alert-danger form-not-valid-alert" role="alert">Los campos marcados en rojo son obligatorios. </div>')
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
      $('#modal-add-producto').modal('toggle')
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
        title: `${auxTitleAction} producto`,
        html: `<p>El producto se ha ${auxTextAction} satisfactoriamente!</p>`
      })
      clearForm()
      loadTable()
    },
    error: err => {
      if (err.status === 422) {
        const listErrors = err.responseJSON.errors.result.errors
        if ($('.form-not-valid-alert').length === 0) {
          $('#formSaveProduct').prepend('<div class="alert alert-danger form-not-valid-alert" role="alert">Los campos marcados en rojo son obligatorios. </div>')
        }
        listErrors.forEach(element => {
          if (element.field === 'name') {
            $('#product-name').addClass('input-error')
          }
          if (element.field === 'waist') {
            $('#producto-talle').addClass('input-error')
          }
          if (element.field === 'stock') {
            $('#producto-stock').addClass('input-error')
          }
          if (element.field === 'type') {
            $('#producto-type').addClass('input-error')
          }
          if (element.field === 'price') {
            $('#producto-precie').addClass('input-error')
          }
          if (element.field === 'descript') {
            $('#producto-descripcion').addClass('input-error')
          }
        })
      }
    },
    beforeSend: () => {
      if (params.action === 'create') {
        $('.saveForm').addClass('disabled')
        $('.saveForm .text').text('Procesando...')
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

function confirmDeleteProduct() {
  Swal.fire({
    icon: 'success',
    title: 'Producto borrado con éxito'
  })
}

function errorDeleteProduct(text) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: `No se pudo eliminar!, Mensaje: ${text}`
  })
}

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TABLES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

function loadTable() {
  $.ajax({
    url: '/v0/productos/all',
    dataType: 'json',
    type: 'GET',
    success: result => {
      createTable(result.result)
    },
    error: err => {
      console.log(err)
    },
    beforeSend: () => {
      $('#tableProductsSpinner').removeClass('d-none')
      $('.divTableProductos').addClass('d-none')
    },
    complete: () => {
      $('#tableProductsSpinner').addClass('d-none')
      $('.divTableProductos').removeClass('d-none')
    }
  })
}

function createTable(dataSet) {
  $('#products_table').dataTable().fnDestroy()
  productsTable = $('#products_table').DataTable({
    data: dataSet,
    columns: [
      {data: '_id'},
      {data: 'name'},
      {data: 'type'},
      {data: 'price'},
      {data: 'waist'},
      {data: 'stock'},
      {data: null}
    ],
    columnDefs: [
      {
        targets: [0],
        visible: false
      },
      {
        targets: [4],
        orderable: false,
        searcheable: false
      },
      {
        targets: -1,
        data: null,
        defaultContent: '<button type="button" class="btn btn-default edit-product" data-toggle="tooltip" data-placement="top" title="Editar" ><i class="fa fa-edit"></i></button><button type="button" class="btn btn-default delete-product"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="Eliminar"></i></button>'
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
