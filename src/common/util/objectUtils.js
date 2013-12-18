(function () {
    "use strict";

    angular.module("st.common.util.objectUtils", []).factory("objectUtils", function () {
        return {
            getProperty: function (o, propertyPath) {
                var propertyPieces = propertyPath.split(".");
                propertyPieces.forEach(function (propertyName) {
                    if (o !== undefined && o !== null) {
                        o = o[propertyName];
                    }
                });
                return o;
            },
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
    });

}());