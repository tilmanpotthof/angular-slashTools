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
