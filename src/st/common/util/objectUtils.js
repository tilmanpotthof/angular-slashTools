(function () {
    'use strict';

    angular.module('st.common.util.objectUtils', []).factory('objectUtils', [function () {
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
             objectUtils.getProperty({name:'myName'}, 'name'); // 'myName'
             objectUtils.getProperty({address:{city:'New York'}}, 'address.city'); // 'New York'
             objectUtils.getProperty({}, 'property'); // undefined
             </pre>
             *
             * @param {object} o Object to get the property from
             * @param {String} propertyPath Path to the property (e.g. 'address.city')
             * @returns {*} Returns the property or undefined.
             */
            getProperty: function (o, propertyPath) {
                var propertyPieces = propertyPath.split('.');
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
             // changes 'myName' to 'John'
             objectUtils.setProperty({name:'myName'}, 'name', 'John');

             // changes 'New  York' to 'L.A.'
             objectUtils.setProperty({address:{city:'New York'}}, 'address.city', 'L.A.');

             // throws an error
             objectUtils.setProperty({}, 'address.city', 'New York');

             // creates the nested property {address:{city:'New York'}} on the object
             objectUtils.setProperty({}, 'address.city', 'New York', true);
             </pre>
             *
             * @param {object} o Object to set the property
             * @param {String} propertyPath Path to the property (e.g. 'address.city')
             * @param {object} o Object to be set as property
             * @param {boolean=} [createProperty=false] If `true` a nested property path will be created.
             * @returns {*} Returns the property or undefined.
             */
            setProperty: function (o, propertyPath, property, createProperty) {
                var propertyPieces = propertyPath.split('.');
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
                        var msg = 'Cannot set "' + nextPropertyName + '" to non existing ' +
                            'property "' + propertyName + '". To create properties set createProperty=true';
                        throw new Error(msg);
                    }
                });

                o[lastPiece] = property;
            }
        };
    }]);

}());
