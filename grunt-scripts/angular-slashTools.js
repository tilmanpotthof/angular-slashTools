/*!
 * angular-slashTools v0.1.0-build-sha.ee64dfb
 * source: https://github.com/tilmanpotthof/angular-slashTools
 * 
 * git-version: ee64dfb
 * Licence: MIT-LICENCE (https://raw2.github.com/tilmanpotthof/angular-slashTools/master/LICENCE)
 */
angular.module("st", [
    "st.common",
    "st.shortcuts"
]);
angular.module("st.common", [
    "st.common.util"
]);
angular.module("st.common.util", [
    "st.common.util.arrayUtils",
    "st.common.util.groupArrayUtils",
    "st.common.util.objectUtils"
]);
angular.module("st.common.util.arrayUtils", [
        "st.common.util.objectUtils"
    ]).factory("arrayUtils", ["objectUtils", function (objectUtils) {
        "use strict"

        /**
         * @ngdoc service
         * @name st.common.util.arrayUtils
         *
         * @description
         * Util service to simplify working with arrays.
         *
         */
        var arrayUtils = {
            /**
             * @ngdoc function
             * @name st.common.util.arrayUtils#inArray
             * @methodOf st.common.util.arrayUtils
             * @function
             *
             * @description
             * Returns true, if an identical `element` is in an `array`.
             * The {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf Array.prototype.indexOf}
             * function is used internally unless the optional parameter `objectEquality` is set to `true`.
             *
             * With the optional parameter `objectEquality` objects are compared by equality not identity with the
             * {@link http://code.angularjs.org/1.2.9/docs/api/angular.equals angular.equals} function.             .
             *
             * <pre>
             arrayUtils.inArray("a", ["a", "b", "c"]); // true
             </pre>
             *
             * @param {object} element Element to check
             * @param {Array.<*>} array Array
             * @param {boolean=} [objectEquality=false] If `true` objects are compared by equality not identity.
             * @returns {boolean} Returns `true` if the element is found.
             */
            inArray: function (element, array, objectEquality) {
                arrayUtils.checkArray(array);

                var found = array.indexOf(element) >= 0;

                // element found or no object equality checks are needed
                if (found || !objectEquality || !angular.isObject(element)) {
                    return found;
                } else {
                    // iterate until an equal element is found
                    array.some(function (arrayElement) {
                        found = angular.equals(element, arrayElement);
                        return found;
                    });
                    return found;
                }
            },
            /**
             * @ngdoc function
             * @name st.common.util.arrayUtils#addOnce
             * @methodOf st.common.util.arrayUtils
             * @function
             *
             * @description
             * Adds an element to an array, if no identical element is in the array and returns `true`.
             * Otherwise the element is ignored and the function returns `false`.
             *
             * With the optional parameter `objectEquality` objects are compared by equality not identity with the
             * {@link http://code.angularjs.org/1.2.9/docs/api/angular.equals angular.equals} function.             .
             *
             * @param {object} element Element to add
             * @param {Array.<*>} array Array
             * @param {boolean=} [objectEquality=false] If `true` objects are compared by equality not identity.
             * @returns {boolean} Returns `true` if the element was added otherwise `false`.
             */
            addOnce: function (element, array, objectEquality) {
                arrayUtils.checkArray(array);
                if (!arrayUtils.inArray(element, array, objectEquality)) {
                    array.push(element);
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * @ngdoc function
             * @name st.common.util.arrayUtils#remove
             * @methodOf st.common.util.arrayUtils
             * @function
             *
             * @description
             * Removes an identical element from an array and returns the array.
             *
             * With the optional parameter `objectEquality` objects are compared by equality not identity with the
             * {@link http://code.angularjs.org/1.2.9/docs/api/angular.equals angular.equals} function.             .
             *
             *
             * @param {object} element Element to remove
             * @param {Array.<*>} array Array
             * @param {boolean=} [objectEquality=false] If `true` objects are compared by equality not identity.
             * @returns {Array.<*>} Returns the `array` to allow method chaining.
             */
            remove: function (element, array, objectEquality) {
                var index = -1;
                if (!objectEquality) {
                    index = array.indexOf(element);
                } else {
                    array.some(function (arrayElement, arrayIndex) {
                        if (angular.equals(element, arrayElement)) {
                            index = arrayIndex;
                            return true;
                        }
                    });
                }
                if (index >= 0) {
                    array.splice(index, 1);
                }
                return array;

            },
            /**
             * @ngdoc function
             * @name st.common.util.arrayUtils#checkArray
             * @methodOf st.common.util.arrayUtils
             * @function
             *
             * @description
             * Checks if the argument is an `array and throws an exception if it is not.
             * Uses the {@link http://code.angularjs.org/1.2.9/docs/api/angular.isArray angular.isArray} function
             * internally.
             *
             * @param {Array.<*>} array Array to be checked
             */
            checkArray: function (array) {
                if (!angular.isArray(array)) {
                    throw new Error("Expected an array but got " + array);
                }
            },
            /**
             * @ngdoc function
             * @name st.common.util.arrayUtils#extractPropertiesFromArray
             * @methodOf st.common.util.arrayUtils
             * @function
             *
             * @description
             * Extracts properties from an array of objects. Not existing properties are ignored.
             *
             * Uses the {@link st.common.util.objectUtils.getProperty objectUtils.getProperty} function internally.
             *
             * <pre>
             var users = [
             {
                 username: "tpotthof",
                 address: {
                     city: "Mainz"
                 }
             },
             {
                 username: "pmueller",
                 address: {
                     city: "Frankfurt"
                 }
             },
             {
                 username: "aschmidt",
                 address: {
                     city: "Mainz"
                 }
             },
             {
                 username: "nlarssen",
                 address: null
             }];

             // returns ["tpotthof", "pmueller", "aschmidt", "nlarssen]
             arrayUtils.extractPropertiesFromArray(users, "username");

             // returns ["Mainz", "Frankfurt", "Wiesbaden"]
             arrayUtils.extractPropertiesFromArray(users, "address.city");
             </pre>
             *
             * @param {Array.<*>} array Array with properties to extract
             * @param {String} propertyPath Path to the property (e.g. "address.city")
             */
            extractPropertiesFromArray: function (array, propertyPath) {
                arrayUtils.checkArray(array);

                var stringPropertyHash = {};
                var extractedProperties = [];

                array.forEach(function (arrayElement) {
                    var property = objectUtils.getProperty(arrayElement, propertyPath);

                    if (property !== undefined && property !== null) {
                        if (angular.isString(property)) {
                            if (stringPropertyHash[property] === undefined) {
                                stringPropertyHash[property] = true;
                                extractedProperties.push(property);
                            }
                        } else {
                            arrayUtils.addOnce(property, extractedProperties, true);
                        }
                    }

                });
                return extractedProperties;
            }
        };
        return arrayUtils;
    }]);

angular.module("st.common.util.groupArrayUtils", [
        "st.common.util.objectUtils",
        "st.common.util.arrayUtils"
    ]).factory("groupArrayUtils", ["objectUtils", "arrayUtils", function (objectUtils, arrayUtils) {
        "use strict"
        /**
         * @ngdoc service
         * @name st.common.util.groupArrayUtils
         *
         * @description
         * Service to group objects stored in arrays by property values.
         * For example an array of users can be grouped by their cities,
         * even if the city is stored a the attribute like `address.city`.
         *
         *
         */
        var groupArrayUtils = {
            /**
             * @ngdoc function
             * @name st.common.util.groupArrayUtils#group
             * @methodOf st.common.util.groupArrayUtils
             * @function
             *
             * @description
             * Groups array elements by attributes specified in the groupDefinition.
             *
             *
             * <pre>
             var users = [
                 {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
                 {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"},
                 {username: "dcrockford", company: "Paypal Inc."}
             ];
             groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});

             // Result
             // [{
             //     company: "//SEIBERT/MEDIA GmbH",
             //     usersForCompany: [
             //         {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
             //         {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"}
             //     ]
             // },{
             //     company: "Paypal Inc.",
             //     usersForCompany: [
             //         {username: "dcrockford", company: "Paypal Inc."}
             //     ]
             // }];
             </pre>
             *
             * @param {Array.<*>} array Array to group
             * @param {object} groupDefinition definition
             * @returns {Array.<*>} grouped array
             *
             * @example
             * This example initializes the scope to a list of names and
             * then uses `ngRepeat` to display every person:
             <example module="st.common.util">
             <file name="index.html">
               <div ng-controller="DataCtrl">
                 <table>
                   <tr ng-repeat="user in users">
                     <td>
                       <input type="text" ng-model="user.username" placeholder="Username"/>
                     </td>
                     <td>
                       <select ng-model="user.company" ng-options="c for c in companies">
                       </select>
                     </td>
                     <td>
                       <button class="btn" ng-click="removeUser(user)">
                         <i class="icon icon-trash"></i>
                       </button>
                     </td>
                   </tr>
                 </table>
                 <button ng-click="addUser()" class="btn">
                   <i class="icon icon-plus"></i> Add user
                 </button>
                 <hr>
                 User grouped by company
                 <ul>
                   <li ng-repeat="companyGroup in usersByCompany">
                     {{ companyGroup.company }}
                     <a ng-click="showUsers = !showUsers">
                       {{ showUsers ? 'hide' : 'show' }} users
                     </a>
                     <ul ng-show="showUsers">
                       <li ng-repeat="user in companyGroup.usersForCompany">
                         {{ user.username }}
                       </li>
                     </ul>
                   </li>
                 </ul>
                 <hr>
                 <div>
                   <a ng-click="showJson = !showJson">
                     {{ showJson ? 'Hide' : 'Show' }} json
                   </a>
                   <pre ng-show="showJson">
                     usersByCompany: {{ usersByCompany | json }}
                   </pre>
                 </div>
               </div>
             </file>
             <file name="app.js">
                function DataCtrl($scope, groupArrayUtils, arrayUtils) {
                    $scope.companies = ["//SEIBERT/MEDIA GmbH", "Paypal Inc.", "Google Inc."];
                    var users = $scope.users = [
                        {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
                        {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"},
                        {username: "dcrockford", company: "Paypal Inc."}
                    ];
                    $scope.addUser = function () {
                        users.push({});
                    };
                    $scope.removeUser = function (user) {
                        arrayUtils.remove(user, users);
                    };
                    $scope.$watch("users", function () {
                        $scope.usersByCompany = groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});
                    }, true);
                  }
             </file>
             </example>
             */
            group: function (array, groupDefinition) {
                arrayUtils.checkArray(array);

                if (angular.isArray(groupDefinition)) {
                    return groupArrayUtils._groupByMultipleDefs(array, groupDefinition);
                } else {
                    var occurrenceHash = {};
                    var groupedData = [];

                    var key = groupDefinition.by;
                    var keyLabel = groupDefinition.as || key;
                    var listLabel = groupDefinition.in;

                    array.forEach(function (element) {
                        var value = objectUtils.getProperty(element, key);
                        var node;
                        if (occurrenceHash[value] === undefined) {
                            node = {};
                            node[keyLabel] = value;
                            node[listLabel] = [];
                            occurrenceHash[value] = node;
                            groupedData.push(node);
                        }
                        occurrenceHash[value][listLabel].push(element);
                    });

                    return groupedData;
                }
            },
            _groupByMultipleDefs: function (array, groupDefinitions) {
                arrayUtils.checkArray(array);
                arrayUtils.checkArray(groupDefinitions);

                if (groupDefinitions.length === 0) {
                    return array;
                } else {
                    var groupDefinition = groupDefinitions[0];
                    var groupDefinitionsRest = groupDefinitions.slice(1);
                    var listLabel = groupDefinition.in;

                    var result = groupArrayUtils.group(array, groupDefinition);
                    result.forEach(function (element) {
                        element[listLabel] = groupArrayUtils._groupByMultipleDefs(element[listLabel], groupDefinitionsRest);
                    });

                    return result
                }
            }
        };
        return groupArrayUtils;
    }]);

(function () {
    "use strict";

    angular.module("st.common.util.objectUtils", []).factory("objectUtils", [function () {
        /**
         * @ngdoc service
         * @name st.common.util.objectUtils
         *
         * @description
         * Util service to set and get object properties by their string path.
         *
         */
        return {
            /**
             * @ngdoc function
             * @name st.common.util.objectUtils#getProperty
             * @methodOf st.common.util.objectUtils
             * @function
             *
             * @description
             * Returns the property of an object described by the `propertyPath` or undefined if not found.
             * The path can be nested like `address.city`in the example below.
             *
             * <pre>
             objectUtils.getProperty({name:"myName"}, "name"); // "myName"
             objectUtils.getProperty({address:{city:"New York"}}, "address.city"); // "New York"
             objectUtils.getProperty({}, "property"); // undefined
             </pre>
             *
             * @param {object} o Object to get the property from
             * @param {String} propertyPath Path to the property (e.g. "address.city")
             * @returns {*} Returns the property or undefined.
             */
            getProperty: function (o, propertyPath) {
                var propertyPieces = propertyPath.split(".");
                propertyPieces.forEach(function (propertyName) {
                    if (o !== undefined && o !== null) {
                        o = o[propertyName];
                    }
                });
                return o;
            },
            /**
             * @ngdoc function
             * @name st.common.util.objectUtils#setProperty
             * @methodOf st.common.util.objectUtils
             * @function
             *
             * @description
             * Sets a property to an object with name of the described `propertyPath`.
             *
             * The path can be nested like `address.city` in the example below, but the nested objects must exists
             * or the function throws an error. This error can we avoided with the optional `createProperty` parameter.
             *
             * <pre>
             // changes "myName" to "John"
             objectUtils.setProperty({name:"myName"}, "name", "John");

             // changes "New  York" to "L.A."
             objectUtils.setProperty({address:{city:"New York"}}, "address.city", "L.A.");

             // throws an error
             objectUtils.setProperty({}, "address.city", "New York");

             // creates the nested property {address:{city:"New York"}} on the object
             objectUtils.setProperty({}, "address.city", "New York", true);
             </pre>
             *
             * @param {object} o Object to set the property
             * @param {String} propertyPath Path to the property (e.g. "address.city")
             * @param {object} o Object to be set as property
             * @param {boolean=} [createProperty=false] If `true` a nested property path will be created.
             * @returns {*} Returns the property or undefined.
             */
            setProperty: function (o, propertyPath, property, createProperty) {
                var propertyPieces = propertyPath.split(".");
                var lastIndex = propertyPieces.length - 1;
                var propertyPiecesWithoutLast = propertyPieces.slice(0, lastIndex);
                var lastPiece = propertyPieces[lastIndex];

                createProperty = !!createProperty;

                propertyPiecesWithoutLast.forEach(function (propertyName, index) {
                    if (o[propertyName] !== undefined && o[propertyName] !== null) {
                        o = o[propertyName];
                    } else if (createProperty) {
                        o = o[propertyName] = {};
                    } else {
                        var nextPropertyName = propertyPieces[index + 1];
                        var msg = "Cannot set '" + nextPropertyName + "' to non existing property '" + propertyName + "'. To create properties set createProperty=true";
                        throw new Error(msg);
                    }
                });

                o[lastPiece] = property;
            }
        };
    }]);

}());

angular.module("st.shortcuts", [
    "st.shortcuts.shortcut",
    "st.shortcuts.shortcutParser",
    "st.shortcuts.shortcutRegistry"
]);
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
angular.module("st.shortcuts.shortcutRegistry", [
        "st.common.util.arrayUtils",
        "st.shortcuts.shortcutParser"
    ]).factory("shortcutRegistry", ["$log", "shortcutParser", "arrayUtils", function ($log, shortcutParser, arrayUtils) {
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

        /**
         * @ngdoc service
         * @name st.shortcuts.shortcutRegistry
         *
         * @description
         * TODO
         *
         */
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
            },
            getAll: function () {
              return angular.copy(shortcutRegistry);
            }
        };
    }]);
