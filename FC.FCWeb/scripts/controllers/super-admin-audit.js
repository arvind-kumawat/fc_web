'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:SuperAdminAuditCtrl
 * @description
 * # SuperAdminAuditCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('SuperAdminAuditCtrl', function ($http, CONSTANT, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $q, $compile, toastr) {

    $scope.audit = {};
    $scope.audit.from_date = new Date();
    $scope.audit.to_date = new Date();

    // Code for datepicker starts here
    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };
    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };
    $scope.formats = ['dd-MM-yyyy'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['d!-M!-yyyy'];

    $scope.popup1 = {
      opened: false
    };
    $scope.popup2 = {
      opened: false
    };
    $scope.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(),
      startingDay: 1
    };
    // Code for datepicker ends here

    $scope.tablesNameList = {
      "products": "Products",
      "main_scores": "Main-scores",
      "sub_main_scores": "Sub main scores",
      "segment_scores": "Segment scores"
    };

    $scope.table_list = [
      {
        value: 'products',
        text: 'Products'
      },
      {
        value: 'main_scores',
        text: 'Main scores'
      },
      {
        value: 'sub_main_scores',
        text: 'Sub main scores'
      },
      {
        value: 'segment_scores',
        text: 'Segment scores'
      }
    ];

    var table_name_list = ['Products', 'Main-scores', 'Sub main scores', 'Segment scores'];

    $scope.getAudit = function (fromDate, toDate) {

      if (!fromDate)
        fromDate = new Date();
      if (!toDate)
        toDate = new Date();

      if (new Date(toDate) < new Date(fromDate)) {
        toastr.error('From date should be lesser or equal to To date');
      } else {

        $scope.dtOptions = DTOptionsBuilder.fromSource(CONSTANT.HOST + 'audits/?fromDate=' + fromDate + '&toDate=' + toDate)
          .withDOM('frtip')
          .withPaginationType('full_numbers')
          .withButtons([
            'print',
            'excel',
            'pdf'
          ])
          .withColumnFilter({
            sPlaceHolder: "head:before",
            aoColumns: [{
              sSelector: "#table_name",
              type: 'select',
              bRegex: false,
              values: table_name_list
            }
            ]
          })
          .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
          })
          .withOption('order', [3, 'desc']);

        $scope.dtColumns = [
          DTColumnBuilder.newColumn('table_name').withTitle('Table').renderWith(function (data, type, full) {
            if (data && data != '' && data != 'null')
              return $scope.tablesNameList[data];
            else
              return 'N/A';
          }),
          DTColumnBuilder.newColumn('action').withTitle('Action').renderWith(function (data, type, full) {
            if (data && data != '' && data != 'null')
              return data;
            else
              return 'N/A';
          }),
          DTColumnBuilder.newColumn('data_changed').withTitle('Changed in').renderWith(function (data, type, full) {
            if (data && data != '' && data != 'null')
              return data;
            else
              return 'N/A';
          }),
          DTColumnBuilder.newColumn('updatedAt').withTitle('Updated on').renderWith(function (data, type, full) {
            if (data && data != '' && data != 'null')
              return moment.tz(data, 'Asia/Calcutta').format('YYYY-MM-DD HH:mm:ss');
            else
              return 'N/A';
          })
        ];
      }
    };

    $scope.getAudit();

  });
