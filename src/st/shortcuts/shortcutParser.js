(function () {
    "use strict";

    var OPTION_KEYS = "alt|ctrl|meta|shift|cmd";
    var OPTION_KEYS_ARRAY = OPTION_KEYS.split("|");
    var SHORTCUT_REGEX = /^((alt|ctrl|meta|shift|cmd)\+)*([a-zA-Z0-9]|enter|esc|left|right|up|down|num[0-9])$/;

    var keyCodes = {
        "enter": 13,
        "esc": 27,
        "left": 37,
        "up": 38,
        "right": 39,
        "down": 40,
        "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57,
        "num0": 96, "num1": 97, "num2": 98, "num3": 99, "num4": 100, "num5": 101, "num6": 102, "num7": 103, "num8": 104, "num9": 105,
        "a": 65, "b": 66, "c": 67, "d": 68, "e": 69, "f": 70, "g": 71, "h": 72, "i": 73, "j": 74, "k": 75, "l": 76, "m": 77, "n": 78, "o": 79, "p": 80, "q": 81, "r": 82, "s": 83, "t": 84, "u": 85, "v": 86, "w": 87, "x": 88, "y": 89, "z": 90};

    var defaults = {
        preventDefault: true,
        stopPropagation: false,
        exclude: "input, textarea",
        includeOnly: ""
    };

    function Shortcut(key, optionKeys, action, options) {
        optionKeys = optionKeys || {};
        options = jQuery.extend({}, defaults, options);

        this.keyCode = keyCodes[key.toLowerCase()];

        if (this.keyCode === undefined) {
            throw new Error("No keyCode known for key: '" + key + "'");
        }

        this.altKey = optionKeys.alt || false;
        this.shiftKey = optionKeys.shift || false;
        this.metaKey = optionKeys.meta || optionKeys.cmd || false;
        this.ctrlKey = optionKeys.ctrl || false;

        this.action = action;

        this.preventDefault = options.preventDefault;
        this.stopPropagation = options.stopPropagation;
        this.exclude = options.exclude;
        this.includeOnly = options.includeOnly;
        this.notation = options.notation;
        this.description = options.description;
    }

    Shortcut.prototype = {
        match: function (e) {
            return this.keyCode === e.keyCode &&
                this.altKey === e.altKey &&
                this.shiftKey === e.shiftKey &&
                this.metaKey === e.metaKey &&
                this.ctrlKey === e.ctrlKey &&
                this._checkTarget(e);
        },
        _checkTarget: function (e) {
            var $target = jQuery(e.target);
            if (this.includeOnly) {
                return $target.is(this.includeOnly);
            }

            return !(this.exclude && $target.is(this.exclude));
        }
    };

    /**
     * @ngdoc service
     * @name st.shortcuts.shortcutParser
     *
     * @description
     * TODO
     *
     */
    angular.module("st.shortcuts.shortcutParser", ["st.common.util.arrayUtils"]).factory("shortcutParser", ["arrayUtils", function (arrayUtils) {
        return {
            create: function (key, optionKeys, action, options) {
                if (angular.isObject(optionKeys)) {
                    return new Shortcut(key, optionKeys, action, options);
                } else {
                    return this.parse(key, action, options);
                }
            },
            checkNotation: function (shortcutNotation) {
                return SHORTCUT_REGEX.test(shortcutNotation);
            },
            parse: function (shortcutNotation, action, options) {
                var match = SHORTCUT_REGEX.exec((shortcutNotation || "").toLowerCase());
                if (match) {
                    var key = match[3];
                    var parts = shortcutNotation.split("+");
                    var optionKeys = {};
                    parts.forEach(function (part) {
                        if (arrayUtils.inArray(part, OPTION_KEYS_ARRAY)) {
                            optionKeys[part] = true;
                        }
                    });
                    if (angular.isObject(options)) {
                        options.notation = shortcutNotation;
                    }
                    return this.create(key, optionKeys, action, options);

                } else {
                    throw new Error("Shortcut notation not correct: '" + shortcutNotation + "'");
                }
            }
        };
    }]);

}());