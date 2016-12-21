angular.module('watchlistApp').filter('listFilter', ['_', 'ListDataFactory',
  function(_, ListDataFactory) {
    'use strict';
    return function(list, itemType, itemState, filter) {
      return _.filter(list, function(obj) {
        let show = true;

        if (filter) {
          show = obj.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        }

        if (show && itemType !== ListDataFactory.ALL) {
          show = obj.type === itemType;
        }

        if (show && itemState !== null) {
          show = obj.watched === itemState;
        }

        return show;
      });
    };
  }
]);