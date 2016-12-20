angular.module('watchlistApp', ['ngRoute', 'templates']);

// set up lodash
angular.module('watchlistApp').factory('_', ['$window',
  function($window) {
    'use strict';
    return $window._;
  }
]);


angular.module('templates', []);


angular.module('watchlistApp').factory('BaseFactory', ['$q', '$http',
  function($q, $http) {
    'use strict';

    class BaseFactory {
      constructor() {
        this.promise = null;
      }

      load() {
        let _this = this;

        if (this.promise) {
          return this.promise;
        }

        this.promise = $q(function(resolve) {
          $http.get(_this.url).success(function(data) {
            _this.data = _this.parseData(data);
            _this.storeState();
            resolve(_this.data);
          });
        });

        return this.promise;
      }

      save(data) {
        let _this = this,
            promise = $q(function(resolve) {
              $http.post(_this.url, data).success(function(data) {
                _this.data = _this.parseData(data);
                _this.storeState();
                resolve(_this.data);
              });
            });

        return promise;
      }

      parseData(data) {
        return data;
      }

      storeState() {} // abstract
    }

    return BaseFactory;
  }
]);


angular.module('watchlistApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'app/list/directives/list.html',
      controllerAs: 'ctrl',
      controller: 'ListController'
    }).when('/add', {
      templateUrl: 'app/list/directives/add.html',
      controller: 'AddController'
    }).otherwise('/'); // always go back to the list
  }
]);


angular.module('watchlistApp').controller('MainController', ['$scope',
  function($scope) {

    $scope.list = [];

  }
]);


angular.module('watchlistApp').directive('messageLog', ['$timeout', '$rootScope','_',
  function($timeout, $rootScope, _) {
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'app/core/directives/message-log.html',
      link: function(scope, $el, attrs) {

        var name = attrs.name;

        scope.name = name;
        scope.messages = [];

        function getMessageKey(message) {
          return message.name
            + '_'
            + message.type
            + '_'
            + message.message.replace(/[^a-zA-Z0-9]/g, '');
        }

        var messageHandler = $rootScope.$on('message', function(evt, message) {

              message.key = getMessageKey(message);
              if (name === message.name
                && !_.filter(scope.messages, {key: message.key}).length) {
                scope.messages.push(message);
              }
            }),
            clearMessagesHandler =
              $rootScope.$on('messages:clear', function(evt, type) {
                if (name === type) {
                  _.each(scope.messages, function(message) {
                    scope.$broadcast('message:clear', message.key);
                  });
                }
              });

        scope.closeMessage = function(evt, $el, message) {
          // hide the message
          $el.addClass('done');
          $timeout(function() {
            var index = scope.messages.indexOf(message);
            if (index !== -1) {
              scope.messages.splice(index, 1);
            }
          }, 500);
          if (evt) {
            evt.stopPropagation();
          }
        };

        scope.$on('$destroy', function() {
          messageHandler();
          clearMessagesHandler();
        });
      }
    };
  }
]);


angular.module('watchlistApp').directive('message', ['$timeout',
  function($timeout) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'app/core/directives/message.html',
      link: function(scope, $el) {
        var time;
        switch (scope.message.type) {
          case 'error':
            break;
          case 'warning':
          case 'info':
            time = scope.message.type === 'info' ? 2000 : 5000;
            if (scope.message.time) {
              time = scope.message.time;
            }
            $timeout(function() {
              scope.closeMessage(null, $el, scope.message);
            }, time);
            break;
        }

        scope.$on('message:clear', function(evt, key) {
          if (key === scope.message.key) {
            scope.closeMessage(null, $el, scope.message);
          }
        });

        $timeout(function() {
          $el.removeClass('done');
        }, 0);
        $el.addClass(scope.message.type);
        $el.children()[0].className += ' icon-' + scope.message.type;
      }
    };
  }
]);


angular.module('watchlistApp').directive('integer', ['_', 'KeyUtil',
  function(_, KeyUtil) {
    'use strict';
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, $el, attr, ctrl) {

        // add a parser
        ctrl.$parsers.unshift(function(value) {
          return parseInt(value, 10);
        });

        $el.bind('keydown', function(evt) {
          var value;
          if (evt.which === KeyUtil.UpKey) {
            value = parseInt(ctrl.$viewValue, 10);
            if (!_.isNaN(value)) {
              value++;
              ctrl.$setViewValue(value);
              ctrl.$render();
            }
          }
          if (evt.which === KeyUtil.DownKey) {
            value = parseInt(ctrl.$viewValue, 10);
            if (!_.isNaN(value)) {
              value--;

              if (attr.min && value < attr.min) {
                value = attr.min;
              }

              ctrl.$setViewValue(value);
              ctrl.$render();
            }
          }
        });
      }
    };
  }
]);


angular.module('watchlistApp').factory('ListDataFactory', ['BaseFactory', 'Movie', 'Series', 'Documentary',
  function(BaseFactory, Movie, Series, Documentary) {

  class ListDataFactory extends BaseFactory{
    constructor() {
      super();
      this.url = 'data/list.json';
    }

    save(data) {
      this.url = 'backend.php';
      let promise = super.save(data);
      this.url = 'data/list.json';
      return promise;
    }

    parseData(data) {
      let _this = this;
      return data.map(function(data) {
        if (data.type === _this.MOVIE) {
          return new Movie(data);
        }
        if (data.type === _this.SERIES) {
          return new Series(data);
        }
        if (data.type === _this.DOCUMENTARY) {
          return new Documentary(data);
        }
      });
    }

    get ALL() {
      return true;
    }

    get MOVIE() {
      return 0;
    }

    get SERIES() {
      return 1;
    }

    get DOCUMENTARY() {
      return 2;
    }

    get TYPES() {
      return [this.SERIES, this.MOVIE, this.DOCUMENTARY];
    }

    new(type) {
      switch(type) {
        case this.MOVIE:
          return new Movie({});
        case this.SERIES:
          return new Series({});
        case this.DOCUMENTARY:
          return new Documentary({});
      }
    }

    getFilterStates() {
      return [
        {
          state: null,
          name: 'All'
        },{
          state: true,
          name: 'Yes'
        },{
          state: false,
          name: 'No'
        }
      ];
    }

    getFilterList() {
      return [
        {
          type: this.ALL,
          name: 'All'
        }
      ].concat(this.getTypeList());
    }

    getTypeList() {
      return [
        {
          type: this.DOCUMENTARY,
          name: 'Documentary'
        }, {
          type: this.MOVIE,
          name: 'Movie'
        }, {
          type: this.SERIES,
          name: 'Series'
        }
      ]
    }
  }

  return new ListDataFactory();
}]);


angular.module('watchlistApp').factory('KeyUtil', function() {
  'use strict';
  var KeyUtil = {
    // control
    TabKey: 9,
    EnterKey: 13,
    SpaceKey: 32,
    BackspaceKey: 8,
    DeleteKey: 46,
    EscapeKey: 27,

    ShiftKey: 16,
    CtrlKey: 17,
    AltKey: 18,
    CommandKey: 91,

    // arrows
    LeftKey: 37,
    UpKey: 38,
    RightKey: 39,
    DownKey: 40,

    // punctuation
    DotKey: 190,
    ColonKey: 186,
    CommaKey: 188,

    // numbers
    OneKey: 49,
    TwoKey: 50,
    ThreeKey: 51,
    FourKey: 52,
    FiveKey: 53,
    SixKey: 54,
    SevenKey: 55,
    EightKey: 56,
    NineKey: 57,
    ZeroKey: 48,

    // letters
    AKey: 65,
    DKey: 68,
    EKey: 69,
    FKey: 70,
    IKey: 73,
    PKey: 80,
    SKey: 83
  };

  KeyUtil.ControlKeys = [
    KeyUtil.TabKey,
    KeyUtil.EnterKey,
    KeyUtil.EscapeKey,
    KeyUtil.ShiftKey,
    KeyUtil.CtrlKey,
    KeyUtil.AltKey,
    KeyUtil.CommandKey
  ];

  KeyUtil.ArrowKeys = [
    KeyUtil.LeftKey,
    KeyUtil.UpKey,
    KeyUtil.RightKey,
    KeyUtil.DownKey
  ];

  KeyUtil.NumberKeys = [
    KeyUtil.OneKey,
    KeyUtil.TwoKey,
    KeyUtil.ThreeKey,
    KeyUtil.FourKey,
    KeyUtil.FiveKey,
    KeyUtil.SixKey,
    KeyUtil.SevenKey,
    KeyUtil.EightKey,
    KeyUtil.NineKey,
    KeyUtil.ZeroKey
  ];

  KeyUtil.isArrowKey = function(keyCode) {
    return KeyUtil.ArrowKeys.indexOf(keyCode) !== -1;
  };

  KeyUtil.isNumberKey = function(keyCode) {
    return KeyUtil.NumberKeys.indexOf(keyCode) !== -1;
  };

  KeyUtil.isAlphaNumericKey = function(keyCode) {
    return KeyUtil.ControlKeys.indexOf(keyCode) === -1
        && KeyUtil.ArrowKeys.indexOf(keyCode) === -1;
  };

  return KeyUtil;
});


angular.module('watchlistApp').controller('ListController', ['$scope', 'ListDataFactory', '$location',
  function($scope, ListDataFactory, $location) {

    $scope.types = ListDataFactory.getFilterList();
    $scope.itemType = ListDataFactory.ALL;
    $scope.states = ListDataFactory.getFilterStates();
    $scope.itemState = null;

    $scope.setItemType = function(type) {
      $scope.itemType = type;
    };

    $scope.setItemState = function(state) {
      $scope.itemState = state;
    };

    ListDataFactory.load().then(function(data) {
      // not so nice...
      $scope.$parent.list = data;
    });

    $scope.getItemTemplate = function() {
      if ($scope.item.type === ListDataFactory.MOVIE) {
        return 'app/list/directives/movie.html';
      }
      if ($scope.item.type === ListDataFactory.SERIES) {
        return 'app/list/directives/series.html';
      }
      if ($scope.item.type === ListDataFactory.DOCUMENTARY) {
        return 'app/list/directives/documentary.html';
      }
    };

    $scope.add = function() {
      $location.path('/add');
    };

  }
]);


angular.module('watchlistApp').filter('listFilter', ['_', 'ListDataFactory',
  function(_, ListDataFactory) {
    'use strict';
    return function(list, itemType, itemState) {
      return _.filter(list, function(obj) {
        let show = true;

        if (itemType !== ListDataFactory.ALL) {
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

angular.module('watchlistApp').directive('list', function() {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/list/directives/list.html'
  };
});

angular.module('watchlistApp').directive('filters', function() {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/list/directives/filters.html'
  };
});

angular.module('watchlistApp').controller('AddController', ['$scope', 'ListDataFactory', '$location',
  function($scope, ListDataFactory, $location) {

    $scope.item = ListDataFactory.new(ListDataFactory.MOVIE);

    $scope.types = ListDataFactory.getTypeList();

    $scope.$watch('item.type', function(value) {
      let name = $scope.item.name,
          year = $scope.item.year;

      $scope.item = ListDataFactory.new(value);

      $scope.item.name = name;

      if ($scope.isSeries()) {
        $scope.item.addSeason(year ? year : $scope.item.year ? $scope.item.year + 1 : null);
      } else {
        $scope.item.year = year;
      }
    });

    $scope.addSeason = function() {
      $scope.item.addSeason($scope.item.lastYear ? $scope.item.lastYear + 1 : null);
    };

    $scope.isSeries = function() {
      return $scope.item.type === ListDataFactory.SERIES;
    };

    $scope.addItem = function() {
      $scope.list.push($scope.item);
      $scope.$root.$emit('message', {
        name: 'general',
        type: 'info',
        message: 'Saving...'
      });

      ListDataFactory.save($scope.list).then(function() {
        $location.path('/');
        $scope.$root.$emit('message', {
          name: 'general',
          type: 'info',
          message: 'Saving was successful'
        });
      });
    };


    $scope.back = function() {
      $location.path('/');
    };    
  }
]);


angular.module('watchlistApp').directive('item', [
  function() {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      template: '<ng-include src="getItemTemplate()"/>',
      controller: 'ListController'
    };
  }
]);


angular.module('watchlistApp').factory('Movie', [
  function() {

  class Movie {
    constructor({name = null, year = null, score = null, watched = false}) {
      this.type = 0;
      this.name = name;
      this.year = year;
      this.score = score;
      this.watched = watched;
    }
  }

  return Movie;
}]);


angular.module('watchlistApp').factory('Documentary', [
  function() {

  class Documentary {
    constructor({name = null, year = null, score = null, watched = false}) {
      this.type = 2;
      this.name = name;
      this.year = year;
      this.score = score;
      this.watched = watched;
    }
  }

  return Documentary;
}]);


angular.module('watchlistApp').factory('Series', ['_', 'Season',
  function(_, Season) {

  class Series {
    constructor({name = null, seasons = []}) {
      this.type = 1;
      this.name = name;
      this.seasons = seasons.map(function(data) {
        return new Season(data);
      });
    }

    addSeason(year = null) {
      this.seasons.push(new Season({year: year}));
    }

    get watched() {
      return _.filter(this.seasons, {watched: false}).length === 0;
    }

    get year() {
      return this.seasons.length ? this.seasons[0].year : null;
    }

    get lastYear() {
      return this.seasons.length ? this.seasons[this.seasons.length -1].year : null;
    }
  }

  return Series;
}]);


angular.module('watchlistApp').factory('Season', [
  function() {

  class Season {
    constructor({year = null, score = null, watched = false}) {
      this.year = year;
      this.score = score;
      this.watched = watched;
    }
  }

  return Season;
}]);


