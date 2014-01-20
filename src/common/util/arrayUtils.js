angular.module("st.common.util.arrayUtils", [
        "st.common.util.objectUtils"
    ]).factory("arrayUtils", ["objectUtils", function (objectUtils) {
        "use strict"
        var arrayUtils = {
            /**
             * Returns true, if an identical element is in an array.
             * With the parameter objectEquality the elements are compared with angular.equals.
             *
             * @param element
             * @param {Array.<*>} array
             * @param {boolean?} objectEquality
             * @returns {boolean}
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
             * Adds an identical element to an array, if it is not in the array and returns if the element is new.
             * With the parameter objectEquality the elements are compared with angular.equals
             *
             * @param element
             * @param {Array.<*>} array
             * @param {boolean?} objectEquality
             * @returns {boolean}
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
             * Removes an identical element from an array and returns the array.
             * With the parameter objectEquality the elements are compared with angular.equals
             *
             * @param element
             * @param {Array.<*>} array
             * @param {boolean?} objectEquality
             * @returns {Array.<*>}
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
             * Checks if the argument is an array and throws an exception if it is not.
             *
             * @param {Array.<*>} array
             */
            checkArray: function (array) {
                if (!angular.isArray(array)) {
                    throw new Error("Expected an array but got " + array);
                }
            },
            /**
             * Extracts properties from an array of elements.
             *
             * @example
             * arrayUtils.extractPropertiesFromArray([{x:10},{x:10,y:11}, {x:12}], "x") // return [10, 12]
             *
             * @param {Array.<*>} array
             * @param {String} propertyPath
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