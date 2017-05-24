angular.module('watchlistApp').filter('listFilter', ['_', 'ListDataFactory',
  function(_, ListDataFactory) {
    'use strict';
    return function(list, filter) {
      return _.filter(list, function(obj) {
        let show = true;

        if (filter.search) {
          show = obj.name.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1;
        }

        if (show && filter.itemType !== ListDataFactory.ALL) {
          show = filter.itemType.indexOf(obj.type) !== -1;
        }

        if (show && filter.itemState !== null) {
          show = obj.watched === filter.itemState;
        }

        return show;
      });
    };
  }
]);