let productsTable

$().ready(() => {
  $('[data-toggle="tooltip"]').on().tooltip()

  loadTable()
})

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
  $('#clients_table').dataTable().fnDestroy()
  productsTable = $('#products_table').DataTable({
    data: dataSet,
    columns: [
      {data: '_id'},
      {data: 'nombre'},
      {data: 'tipo'},
      {data: 'precio'},
      {data: 'talle'},
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
        defaultContent: '<button type="button" class="btn btn-default edit-product" data-toggle="tooltip" data-placement="top" title="Editar" ><i class="fa fa-edit"></i></button><button type="button" class="btn btn-default delete-productPs"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="Eliminar"></i></button>'
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
