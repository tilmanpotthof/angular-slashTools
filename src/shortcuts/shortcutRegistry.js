angular.module("st.shortcuts.shortcutRegistry", [
        "st.common.util.arrayUtils",
        "st.shortcuts.shortcutParser"
    ]).factory("shortcutRegistry", function ($log, shortcutParser, arrayUtils) {
        "use strict";

        var shortcutRegistry = [];

        function applyEvent(e) {
            angular.forEach(shortcutRegistry, function (shortcut) {
                if (shortcut.match(e)) {
                    $log.debug("shortcut: " + shortcut.notation);
                    shortcut.action(e);

                    if (shortcut.preventDefault) {
                        e.preventDefault();
                    }
                    if (shortcut.stopPropagation) {
                        e.stopPropagation();
                    }

                }
            });
        }

        jQuery(document).on("keydown", applyEvent);

        return {
            register: function (notation, action, options) {
                var shortcut = shortcutParser.parse(notation, action, options);
                shortcutRegistry.push(shortcut);
                return shortcut;
            },
            unregister: function (shortcut) {
                arrayUtils.remove(shortcut, shortcutRegistry);
            },
            displayData: function () {
                return shortcutRegistry.map(function (shortcut) {
                    return {
                        keys: shortcut.notation,
                        description: shortcut.description
                    };
                });
            }
        };
    });
