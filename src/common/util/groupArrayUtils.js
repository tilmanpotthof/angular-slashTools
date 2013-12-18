angular.module("st.common.util.groupArrayUtils", [
        "st.common.util.objectUtils"
    ]).factory("groupArrayUtils", function (objectUtils) {
        "use strict"
        var groupArrayUtils = {
            /**
             * Groups array elements by attributes specified in the groupDefinition.
             *
             * @example
             *  var users = [
             *      {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
             *      {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"},
             *      {username: "dcrockford", company: "Paypal Inc."}
             *  ];
             *  groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});
             *
             *  // Result
             *  // [{
             *  //     company: "//SEIBERT/MEDIA GmbH",
             *  //     usersForCompany: [
             *  //         {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
             *  //         {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"}
             *  //     ]
             *  // },{
             *  //     company: "Paypal Inc.",
             *  //     usersForCompany: [
             *  //         {username: "dcrockford", company: "Paypal Inc."}
             *  //     ]
             *  // }];
             *
             * @param {Array.<*>} array
             * @param {object} groupDefinition
             * @returns {Array.<*>}
             */
            group: function (array, groupDefinition) {
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
        };
        return groupArrayUtils;
    });
