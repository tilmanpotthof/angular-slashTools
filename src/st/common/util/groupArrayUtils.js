angular.module('st.common.util.groupArrayUtils', [
        'st.common.util.objectUtils',
        'st.common.util.arrayUtils'
    ]).factory('groupArrayUtils', ['objectUtils', 'arrayUtils', function (objectUtils, arrayUtils) {
        'use strict';

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
                 {username: 'tpotthof', company: '//SEIBERT/MEDIA GmbH'},
                 {username: 'mclasen', company: '//SEIBERT/MEDIA GmbH'},
                 {username: 'dcrockford', company: 'Paypal Inc.'}
             ];
             groupArrayUtils.group(users, {by: 'company', in: 'usersForCompany'});

             // Result
             // [{
             //     company: '//SEIBERT/MEDIA GmbH',
             //     usersForCompany: [
             //         {username: 'tpotthof', company: '//SEIBERT/MEDIA GmbH'},
             //         {username: 'mclasen', company: '//SEIBERT/MEDIA GmbH'}
             //     ]
             // },{
             //     company: 'Paypal Inc.',
             //     usersForCompany: [
             //         {username: 'dcrockford', company: 'Paypal Inc.'}
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
             <example module='st.common.util'>
             <file name='index.html'>
               <div ng-controller='DataCtrl'>
                 <table>
                   <tr ng-repeat='user in users'>
                     <td>
                       <input type='text' ng-model='user.username' placeholder='Username'/>
                     </td>
                     <td>
                       <select ng-model='user.company' ng-options='c for c in companies'>
                       </select>
                     </td>
                     <td>
                       <button class='btn' ng-click='removeUser(user)'>
                         <i class='icon icon-trash'></i>
                       </button>
                     </td>
                   </tr>
                 </table>
                 <button ng-click='addUser()' class='btn'>
                   <i class='icon icon-plus'></i> Add user
                 </button>
                 <hr>
                 User grouped by company
                 <ul>
                   <li ng-repeat='companyGroup in usersByCompany'>
                     {{ companyGroup.company }}
                     <a ng-click='showUsers = !showUsers'>
                       {{ showUsers ? 'hide' : 'show' }} users
                     </a>
                     <ul ng-show='showUsers'>
                       <li ng-repeat='user in companyGroup.usersForCompany'>
                         {{ user.username }}
                       </li>
                     </ul>
                   </li>
                 </ul>
                 <hr>
                 <div>
                   <a ng-click='showJson = !showJson'>
                     {{ showJson ? 'Hide' : 'Show' }} json
                   </a>
                   <pre ng-show='showJson'>
                     usersByCompany: {{ usersByCompany | json }}
                   </pre>
                 </div>
               </div>
             </file>
             <file name='app.js'>
                function DataCtrl($scope, groupArrayUtils, arrayUtils) {
                    $scope.companies = ['//SEIBERT/MEDIA GmbH', 'Paypal Inc.', 'Google Inc.'];
                    var users = $scope.users = [
                        {username: 'tpotthof', company: '//SEIBERT/MEDIA GmbH'},
                        {username: 'mclasen', company: '//SEIBERT/MEDIA GmbH'},
                        {username: 'dcrockford', company: 'Paypal Inc.'}
                    ];
                    $scope.addUser = function () {
                        users.push({});
                    };
                    $scope.removeUser = function (user) {
                        arrayUtils.remove(user, users);
                    };
                    $scope.$watch('users', function () {
                        $scope.usersByCompany = groupArrayUtils.group(users, {by: 'company', in: 'usersForCompany'});
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
                        element[listLabel] = groupArrayUtils._groupByMultipleDefs(element[listLabel],
                            groupDefinitionsRest);
                    });

                    return result;
                }
            }
        };
        return groupArrayUtils;
    }]);
