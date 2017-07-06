angular
  .module('blob')
  .directive('blob', () => ({
    scope: {
      blob: '=',
    },
    link($scope, elem, attr) {
      elem.bind('change', (changeEvent) => {
        const reader = new FileReader();
        reader.onload = function (loadEvent) {
          $scope.$apply(() => {
            $scope.blob = loadEvent.target.result;
          });
        };
        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    },
  }));
