angular.module("st.shortcuts.shortcut", [
        "st.shortcuts.shortcutRegistry"
    ]).directive("shortcut", ["$parse", "$log", "shortcutRegistry", function ($parse, $log, shortcutRegistry) {
        "use strict";

        /**
         * @ngdoc directive
         * @name st.shortcuts.shortcut:shortcut
         *
         * @description
         * TODO
         *
         */
        return {
            restrict: "A,E",
            link: function ($scope, element, attributes) {
                var action, notation;

                if (element.is("shortcut")) {
                    if (!attributes.keys) {
                        throw new Error("Attribute 'keys' is required for the shortcut directive.")
                    }
                    notation = attributes.keys.toLowerCase();
                } else {
                    notation = attributes.shortcut.toLowerCase();
                }

                if (attributes.action) {
                    action = function (e) {
                        $scope.$eval(attributes.action, {
                            $target: jQuery(e.target),
                            $element: element
                        });
                        $scope.$apply();
                    };
                }
                if (attributes.shortcutTrigger) {
                    action = function () {
                        element.trigger(attributes.shortcutTrigger);
                    };
                }

                var options = {
                    preventDefault: $scope.$eval(attributes.preventDefault),
                    stopPropagation: $scope.$eval(attributes.stopPropagation),
                    exclude: attributes.exclude,
                    includeOnly: attributes.includeOnly,
                    notation: notation,
                    description: attributes.shortcutDescription || attributes.description
                };

                if (attributes.hasOwnProperty("shortcutAddTooltip")) {
                    element.tooltip(jQuery.extend({
                        title: attributes.shortcut.toUpperCase(),
                        placement: "right",
                        delay: {show: 2000, hide: 0}
                    }, $scope.$eval(attributes.shortcutAddTooltip)));
                }

                var shortcut = shortcutRegistry.register(notation, action, options);

                $scope.$on("$destroy", function () {
                    shortcutRegistry.unregister(shortcut);
                });
            }
        };
    }]);
