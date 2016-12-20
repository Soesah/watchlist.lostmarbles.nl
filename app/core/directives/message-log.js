angular.module('watchlistApp').directive('messageLog', ['$timeout', '$rootScope','_',
  function($timeout, $rootScope, _) {
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'app/core/directives/message-log.html',
      link: function(scope, $el, attrs) {

        let name = attrs.name,
            messageHandler,
            clearMessagesHandler;

        scope.name = name;
        scope.messages = [];

        function getMessageKey(message) {
          return message.name
            + '_'
            + message.type
            + '_'
            + message.message.replace(/[^a-zA-Z0-9]/g, '');
        }

        messageHandler = $rootScope.$on('message', function(evt, message) {
          message.key = getMessageKey(message);
          if (name === message.name
            && !_.filter(scope.messages, {key: message.key}).length) {
            scope.messages.push(message);
          }
        });
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
            let index = scope.messages.indexOf(message);
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
