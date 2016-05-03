'use strict';

/**
 * @ngdoc directive
 * @name uiAccordion.directive:ngAccordionGroup
 * @description
 * # ngAccordionGroup
 */
angular.module('uiAccordion')
  .directive('ngAccordionGroup', function (accordionGroup,$q,$timeout) {
      return {
          require: ['^ngAccordion', 'ngAccordionGroup'],
          restrict: 'EA',
          controller: 'NgAccordionGroupCtrl',
          scope: {
              options: '=?'
          },
          link: function (scope, element, attrs, controllers) {
              var accordionCtrl, controller, accordion, _accordionGroup, _defaultOptions;
              controller = controllers[1];
              accordionCtrl = controllers[0];
              accordion = accordionCtrl.accordion;
              _accordionGroup = accordionGroup.createAccordionGrp();
              _defaultOptions = accordionGroup.defaultAccordionGroupOptions();
              scope.options = scope.options || {};

              function safeExtend(target, source) {
                  var sourceKeys = Object.keys(source);
                  for (var i = 0; i < sourceKeys.length; i++) {
                      target[sourceKeys[i]] = target[sourceKeys[i]] || _defaultOptions[sourceKeys[i]];
                  }
              }

              safeExtend(scope.options, _defaultOptions);
              _accordionGroup.options = scope.options;

              scope.$watch('options', function (n) {
                  safeExtend(_accordionGroup.options, n);
                  if (n && !n.disabled) {
                      accordion.applyState(_accordionGroup);
                  }
              }, true);

              $q.all([controller.getHeaderElement(), controller.getBodyElement()]).then(function (results) {
                  _accordionGroup.header = results[0];
                  _accordionGroup.body = results[1];
                  if (scope.options.open) {
                      _accordionGroup.$animate('show', 'beforeOpen', 'animateOpen');
                  } else {
                      _accordionGroup.$animate('hide', 'beforeHide', 'animateClose');
                  }
                  _accordionGroup.header.on('click', function () {
                      if (!_accordionGroup.options.disabled) {
                          _accordionGroup.options.open = !_accordionGroup.options.open;
                          accordion.applyState(_accordionGroup);
                      }
                      $timeout(function () {
                          scope.$apply();
                      });
                  });
                  accordion.addGroup(_accordionGroup);
              });

          }
      };
  });
