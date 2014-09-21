/*!
 * angular-slashTools v0.1.0-build-sha.ee64dfb
 * source: https://github.com/tilmanpotthof/angular-slashTools
 * 
 * git-version: ee64dfb
 * Licence: MIT-LICENCE (https://raw2.github.com/tilmanpotthof/angular-slashTools/master/LICENCE)
 */
describe('service', function () {
    'use strict';
    beforeEach(module('st.common.util.arrayUtils'));

    // objects for identity / equality checks
    var x10_1 = {x: 10};
    var x10_2 = {x: 10};
    var x10_3 = {x: 10};
    var x12 = {x: 12};

    describe('arrayUtils.inArray', function () {

        it('should check if an element is in an array', inject(function (arrayUtils) {
            expect(arrayUtils.inArray(0, [0, 1, 2])).toEqual(true);
        }));
        it('should check if an identical object is in an array', inject(function (arrayUtils) {
            expect(arrayUtils.inArray(x10_1, [x10_3, x10_2, x10_1, x12])).toEqual(true);
            expect(arrayUtils.inArray(x10_1, [x10_1, x10_1, x10_1, x10_1])).toEqual(true);
            expect(arrayUtils.inArray(x10_1, [x10_3, x10_2, x12])).toEqual(false);
        }));

        it('should check if an identical object is in an array', inject(function (arrayUtils) {
            // just identify but with explicit parameter
            expect(arrayUtils.inArray(x10_1, [x10_1], false)).toEqual(true);

            // equals check for identical object
            expect(arrayUtils.inArray(x10_1, [x10_1], true)).toEqual(true);

            // equals for non identical but equal objects
            expect(arrayUtils.inArray(x10_1, [x10_2], true)).toEqual(true);
            expect(arrayUtils.inArray(x10_1, [x12, x10_2, x12], true)).toEqual(true);

            // equals for non identical and non equal
            expect(arrayUtils.inArray(x10_1, [x12], true)).toEqual(false);
        }));
    });
    describe('arrayUtils.addOnce', function () {
        var data = [6, 5, 4, 1, 2, 3, 4, 4, 5, 3, 6, 1, 2, 3, 4, 5, 3, 1, 1, 1, 1, 1, 1];
        it('should add an element to an array only once', inject(function (arrayUtils) {
            var array = [];

            data.forEach(function (value) {
                var isNewValue = !arrayUtils.inArray(value, array);
                var addOnceReturn = arrayUtils.addOnce(value, array);
                expect(addOnceReturn).toEqual(isNewValue);
            });
            array.sort();
            expect(array).toEqual([1, 2, 3, 4, 5, 6]);
        }));
    });
    describe('arrayUtils.checkArray', function () {
        it('should throw an error for undefined', inject(function (arrayUtils) {
            expect(function () {
                arrayUtils.checkArray(undefined);
            }).toThrow(new Error("Expected an array but got undefined"));
        }));

        it('should throw an error for something else than arrays', inject(function (arrayUtils) {
            expect(function () {
                arrayUtils.checkArray({});
            }).toThrow(new Error("Expected an array but got [object Object]"));
            expect(function () {
                arrayUtils.checkArray(1);
            }).toThrow(new Error("Expected an array but got 1"));
        }));
    });

    describe('arrayUtils.extractPropertyFromArray', function () {
        var users = [
            {
                username: "tpotthof",
                address: {
                    number: 33,
                    street: "Adam-Karrillon-Str",
                    city: "Mainz"
                }
            },
            {
                username: "mlaspe",
                address: {
                    city: "Wiesbaden"
                }
            },
            {
                username: "jseibert",
                address: {
                    city: "Wiesbaden"
                }
            },
            {
                username: "bborbe",
                address: null
            }
        ];
        var usernames = ["tpotthof", "mlaspe", "jseibert", "bborbe"];
        var cities = ["Mainz", "Wiesbaden"];
        var addresses = [
            {
                number: 33,
                street: "Adam-Karrillon-Str",
                city: "Mainz"
            },
            {
                city: "Wiesbaden"
            }
        ];

        it('should throw an error for undefined', inject(function (arrayUtils) {
            expect(function () {
                arrayUtils.extractPropertiesFromArray(undefined, "x");
            }).toThrow(new Error("Expected an array but got undefined"));
        }));

        it('should throw an error for something else than arrays', inject(function (arrayUtils) {
            expect(function () {
                arrayUtils.extractPropertiesFromArray({}, "x");
            }).toThrow(new Error("Expected an array but got [object Object]"));
            expect(function () {
                arrayUtils.extractPropertiesFromArray(1, "x");
            }).toThrow(new Error("Expected an array but got 1"));
        }));

        it('should return an empty array for an empty array', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray([], "x")).toEqual([]);
        }));

        it('should extract the usernames from the array', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray(users, "username")).toEqual(usernames);
        }));

        it('should extract the cities in the address from the array', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray(users, "address.city")).toEqual(cities);
        }));

        it('should extract the addresses from the array', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray(users, "address")).toEqual(addresses);
        }));

        it('should return an empty array for an not existing property', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray(users, "address.birthday")).toEqual([]);
        }));

    });
    describe('arrayUtils.remove', function () {

        it('should remove an equal number or string from the array', inject(function (arrayUtils) {
            expect(arrayUtils.remove(3, [5, 4, 3, 2, 1, 0])).toEqual([5, 4, 2, 1, 0]);
            expect(arrayUtils.remove(6, [5, 4, 3, 2, 1, 0])).toEqual([5, 4, 3, 2, 1, 0]);
            expect(arrayUtils.remove(5, [5, 5, 5])).toEqual([5, 5]);
            expect(arrayUtils.remove("5", [5, "5"])).toEqual([5]);
            expect(arrayUtils.remove("a", ["aaa", "aa", "a"])).toEqual(["aaa", "aa"]);
        }));


        it('should remove an identical object from the array', inject(function (arrayUtils) {
            var a = {};
            var b = {};
            var c = {};

            expect(arrayUtils.remove(a, [c, b, a])).toEqual([c, b]);
            expect(arrayUtils.remove(a, [b, c, b, c])).toEqual([b, c, b, c]);
            expect(arrayUtils.remove(a, [a, a, a])).toEqual([a, a]);
        }));

        it('should remove an equal object from the array', inject(function (arrayUtils) {
            var a1 = {x: 0};
            var a2 = {x: 0};
            var b = {x: 1};

            expect(arrayUtils.remove(a1, [a1, a1, a1], true)).toEqual([a1, a1]);
            expect(arrayUtils.remove(a1, [a2, a1, a2], true)).toEqual([a1, a2]);
            expect(arrayUtils.remove(a2, [b, b, b, a1], true)).toEqual([b, b, b]);
            expect(arrayUtils.remove(a1, [b], true)).toEqual([b]);
            expect(arrayUtils.remove(a1, [a2], true)).toEqual([]);
            expect(arrayUtils.remove(b, [a2], true)).toEqual([a2]);
        }));

        it('should remove an equal complex object from the array', inject(function (arrayUtils) {
            var a1 = {x: 0, a: [1, 2, {}, 3, {bla: 10}]};
            var a2 = {x: 0, a: [1, 2, {}, 3, {bla: 10}]};

            var b = {x: 0, a: [1, 2, {}, 3, {bla: 77}]};

            expect(arrayUtils.remove(a1, [a1, a1, a1], true)).toEqual([a1, a1]);
            expect(arrayUtils.remove(a1, [a2, a1, a2], true)).toEqual([a1, a2]);
            expect(arrayUtils.remove(a2, [b, b, b, a1], true)).toEqual([b, b, b]);
            expect(arrayUtils.remove(a1, [b], true)).toEqual([b]);
            expect(arrayUtils.remove(a1, [a2], true)).toEqual([]);
            expect(arrayUtils.remove(b, [a2], true)).toEqual([a2]);
        }));

    });
});

describe('service', function () {
    'use strict';
    beforeEach(module('st.common.util.groupArrayUtils'));

    describe('groupArrayUtils.group', function () {

        it('should accept only arrays', inject(function (groupArrayUtils) {
            expect(function () {
                groupArrayUtils.group({}, {by: "company", in: "usersForCompany"});
            }).toThrow(new Error("Expected an array but got [object Object]"));
        }));

        it('should group a users array by companies', inject(function (groupArrayUtils) {
            var users = [
                {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
                {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"},
                {username: "dcrockford", company: "Paypal Inc."}
            ];
            var groupedUsers = groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});

            expect(groupedUsers).toEqual([
                {
                    company: "//SEIBERT/MEDIA GmbH",
                    usersForCompany: [
                        {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
                        {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"}
                    ]
                },
                {
                    company: "Paypal Inc.",
                    usersForCompany: [
                        {username: "dcrockford", company: "Paypal Inc."}
                    ]
                }
            ]);
        }));

        var tpotthof = {
            username: "tpotthof",
            company: "//SEIBERT/MEDIA GmbH",
            address: {
                city: "Mainz"
            }
        };
        var mclasen = {
            username: "mclasen",
            company: "//SEIBERT/MEDIA GmbH",
            address: {
                city: "Wiesbaden"
            }
        };
        var dcrockford = {
            username: "dcrockford",
            company: "Paypal Inc.",
            address: {
                city: "San José"
            }
        };
        var jgrabo = {
            username: "jgrabo",
            company: "//SEIBERT/MEDIA GmbH",
            address: {
                city: "Wiesbaden"
            }
        };
        var sballmer = {
            username: "sballmer",
            company: "Microsoft",
            address: {
                city: "Redmond"
            }
        };
        var pherwarth = {
            username: "pherwarth",
            company: "Gartentechnik GmbH",
            address: {
                city: "Wiesbaden"
            }
        };

        var users = [tpotthof, mclasen, dcrockford, jgrabo, sballmer, pherwarth];


        it('should group users in an array by company', inject(function (groupArrayUtils) {
            var grouped = groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});
            expect(grouped).toEqual([
                {
                    company: "//SEIBERT/MEDIA GmbH",
                    usersForCompany: [tpotthof, mclasen, jgrabo]
                },
                {
                    company: "Paypal Inc.",
                    usersForCompany: [dcrockford]
                },
                {
                    company: "Microsoft",
                    usersForCompany: [sballmer]
                },
                {
                    company: "Gartentechnik GmbH",
                    usersForCompany: [pherwarth]
                }
            ]);
        }));

        it('should group users in an array by city', inject(function (groupArrayUtils) {
            var grouped = groupArrayUtils.group(users, {by: "address.city", as: "city", in: "usersForCity"});
            expect(grouped).toEqual([
                {
                    city: "Mainz",
                    usersForCity: [tpotthof]
                },
                {
                    city: "Wiesbaden",
                    usersForCity: [mclasen, jgrabo, pherwarth]
                },
                {
                    city: "San José",
                    usersForCity: [dcrockford]
                },
                {
                    city: "Redmond",
                    usersForCity: [sballmer]
                }
            ]);
        }));

        it('should group the array with multiple definitions', inject(function (groupArrayUtils) {
            var result = groupArrayUtils.group(users, [
                {by: "company", in: "usersForCompany"},
                {by: "address.city", as: "city", in: "usersForCity"}
            ]);

            expect(result).toEqual([
                {
                    company: "//SEIBERT/MEDIA GmbH",
                    usersForCompany: [
                        {
                            city: "Mainz",
                            usersForCity: [tpotthof]
                        },
                        {
                            city: "Wiesbaden",
                            usersForCity: [mclasen, jgrabo]
                        }
                    ]
                },
                {
                    company: "Paypal Inc.",
                    usersForCompany: [
                        {
                            city: "San José",
                            usersForCity: [dcrockford]
                        }
                    ]
                },
                {
                    company: "Microsoft",
                    usersForCompany: [
                        {
                            city: "Redmond",
                            usersForCity: [sballmer]
                        }
                    ]
                },
                {
                    company: "Gartentechnik GmbH",
                    usersForCompany: [
                        {
                            city: "Wiesbaden",
                            usersForCity: [pherwarth]
                        }
                    ]
                }
            ]);
        }));
    });
});

'use strict';

/* jasmine specs for services go here */

describe('service', function () {
    beforeEach(module('st.common.util.objectUtils'));

    describe('objectUtils.getProperty', function () {
        var user = {
            username: "tpotthof",
            address: {
                number: 33,
                street: "Adam-Karrillon-Str",
                city: "Mainz"
            }
        };

        it('should return undefined for undefined', inject(function (objectUtils) {
            expect(objectUtils.getProperty(undefined, "username")).toEqual(undefined);
        }));

        it('should return undefined for non existing property', inject(function (objectUtils) {
            expect(objectUtils.getProperty(user, "birthday")).toEqual(undefined);
            expect(objectUtils.getProperty(user, "x.y.z")).toEqual(undefined);

        }));

        it("should get city from user's address", inject(function (objectUtils) {
            expect(objectUtils.getProperty(user, "address.city")).toEqual("Mainz");
        }));
    });


    describe('objectUtils.setProperty', function () {
        var user = {};

        it('should set the username to tpotthof', inject(function (objectUtils) {
            objectUtils.setProperty(user, "username", "tpotthof");
            expect(user.username).toEqual("tpotthof");
        }));

        it('should throw an error for setting to a non existing attribute adress', inject(function (objectUtils) {
            expect(function () {
                objectUtils.setProperty(user, "address.city", "Mainz");
            }).toThrow(new Error("Cannot set 'city' to non existing property 'address'. To create properties set createProperty=true"));
        }));

        it('should set the city in the existing address to Mainz', inject(function (objectUtils) {
            // create an empty address property
            user.address = {};
            objectUtils.setProperty(user, "address.city", "Mainz");
            expect(user.address.city).toEqual("Mainz");
        }));

        it("should set 'github' in the non existing attribute 'social' to 'http://github.com/tilmanpotthof'", inject(function (objectUtils) {
            // set createProperty = true;
            objectUtils.setProperty(user, "social.github", "http://github.com/tilmanpotthof", true);
            expect(user.social.github).toEqual("http://github.com/tilmanpotthof");
        }));

        it("should set 'flying' in the non existing attribute 'other.superpowers' to 'Like a pro!'", inject(function (objectUtils) {
            objectUtils.setProperty(user, "other.superpowers.flying", "Like a pro!", true);
            expect(user.other.superpowers.flying).toEqual("Like a pro!");
        }));
    });
});

'use strict';

describe('Directive: shortcut', function () {

    // load the controller's module
    beforeEach(module('st.shortcuts'));

    var $scope, $shortcut;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, $compile) {
        $scope = $rootScope.$new();
    }));

    describe("element syntax", function () {
        it('should throw an error if no shortcut is specified', inject(function ($compile) {
            expect(function () {
                $shortcut = $compile('<shortcut></shortcut>')($scope);
            }).toThrow(new Error("Attribute 'keys' is required for the shortcut directive."));
        }));

        it('should register a shortcut', inject(function ($compile, shortcutRegistry) {
            $shortcut = $compile('<shortcut keys="cmd+a"></shortcut>')($scope);
            var shortcuts = shortcutRegistry.getAll();
            expect(shortcuts.length).toBe(1);
            expect(shortcuts[0].notation).toBe("cmd+a");
        }));

        it('should invoke a test action through the registered shortcut', inject(function ($compile, shortcutRegistry) {
            $scope.testAction = function () {
            };
            spyOn($scope, "testAction");

            $shortcut = $compile('<shortcut keys="cmd+a" action="testAction()"></shortcut>')($scope);
            $scope.$apply();

            var wrappedShortcutAction = shortcutRegistry.getAll()[0].action;
            wrappedShortcutAction({});

            expect($scope.testAction).toHaveBeenCalled();
        }));
    })

    describe("attribute syntax", function () {
        it('should throw an error if no shortcut is specified', inject(function ($compile) {
            expect(function () {
                $shortcut = $compile('<div shortcut></div>')($scope);
            }).toThrow(new Error("Shortcut notation not correct: ''"));
        }));

        it('should register a shortcut', inject(function ($compile, shortcutRegistry) {
            $shortcut = $compile('<div shortcut="cmd+a"></div>')($scope);
            var shortcuts = shortcutRegistry.getAll();
            expect(shortcuts.length).toBe(1);
            expect(shortcuts[0].notation).toBe("cmd+a");
        }));

        it('should trigger a click on a div element', inject(function ($compile, shortcutRegistry) {
            $scope.testAction = function () {
            };
            spyOn($scope, "testAction");

            $shortcut = $compile('<div shortcut="cmd+a" shortcut-trigger="click" ng-click="testAction()"></div>')($scope);
            $scope.$apply();

            var wrappedShortcutAction = shortcutRegistry.getAll()[0].action;
            wrappedShortcutAction({});

            expect($scope.testAction).toHaveBeenCalled();
        }));
    })

});

'use strict';
/*global describe, beforEach */

/* jasmine specs for services go here */

describe('service', function () {
    beforeEach(module('st.shortcuts.shortcutParser'));

    describe('shortcutParser.create', function () {
        it('should return a new ctrl+A shortcut', inject(function (shortcutParser) {
            var ctrlA = shortcutParser.create("A", {ctrl: true});

            expect(ctrlA.keyCode).toEqual(65);
            expect(ctrlA.ctrlKey).toEqual(true);
            expect(ctrlA.altKey).toEqual(false);
            expect(ctrlA.metaKey).toEqual(false);
            expect(ctrlA.shiftKey).toEqual(false);
        }));
        it('should return a new cmd+C shortcut', inject(function (shortcutParser) {
            var cmdC = shortcutParser.create("cmd+C");

            expect(cmdC.keyCode).toEqual(67);
            expect(cmdC.ctrlKey).toEqual(false);
            expect(cmdC.altKey).toEqual(false);
            expect(cmdC.metaKey).toEqual(true);
            expect(cmdC.shiftKey).toEqual(false);
        }));
    });
    describe('shortcutParser.checkNotation', function () {
        it('should tell if a shortcut notation is correct', inject(function (shortcutParser) {
            expect(shortcutParser.checkNotation("ctrl+A")).toEqual(true);
        }));
    });

    describe('shortcutParser.parse', function () {
        it('should parse ctrl+A', inject(function (shortcutParser) {
            var ctrlA = shortcutParser.create("A", {ctrl: true});
            expect(shortcutParser.parse("ctrl+A")).toEqual(ctrlA);
        }));
        it('should parse cmd+A', inject(function (shortcutParser) {
            var cmdA = shortcutParser.create("A", {cmd: true});
            expect(shortcutParser.parse("cmd+A")).toEqual(cmdA);
        }));
        it('should parse shift+cmd+Z', inject(function (shortcutParser) {
            var shiftCmdZ = shortcutParser.create("Z", {cmd: true, shift: true});
            expect(shortcutParser.parse("shift+cmd+Z")).toEqual(shiftCmdZ);
        }));
    });

    var mockEvent = {
        altKey: false,
        bubbles: true,
        cancelable: true,
        charCode: 0,
        ctrlKey: false,
        eventPhase: 3,
        jQuery110206361500238999724: true,
        keyCode: 65,
        metaKey: true,
        shiftKey: false,
        timeStamp: 1383868454724,
        type: "keydown",
        view: window,
        which: 65
    };

    describe('cmdA.match', function () {
        it('should match an mocked event', inject(function (shortcutParser) {
            var cmdA = shortcutParser.parse("cmd+A");
            expect(cmdA.keyCode).toEqual(mockEvent.keyCode);
            expect(cmdA.altKey).toEqual(mockEvent.altKey);
            expect(cmdA.metaKey).toEqual(mockEvent.metaKey);
            expect(cmdA.shiftKey).toEqual(mockEvent.shiftKey);
            expect(cmdA.ctrlKey).toEqual(mockEvent.ctrlKey);

        }));
    });
    describe('cmdA.match', function () {
        it('should match an mocked event', inject(function (shortcutParser) {
            expect(shortcutParser.parse("cmd+A").match(mockEvent)).toEqual(true);
        }));
    });
    describe('ctrlA.match', function () {
        it('should not match an mocked event', inject(function (shortcutParser) {
            expect(shortcutParser.parse("ctrl+A").match(mockEvent)).toEqual(false);
        }));
    });
    describe('altCmdA.match', function () {
        it('should not match an mocked event', inject(function (shortcutParser) {
            expect(shortcutParser.parse("alt+ctrl+A").match(mockEvent)).toEqual(false);
        }));
    });

});

'use strict';
/*global describe, beforEach */

/* jasmine specs for services go here */

describe('service', function () {
    beforeEach(module('st.shortcuts.shortcutRegistry'));

    describe('shortcutRegistry.register', function () {
        it('should throw an error for no arguments', inject(function (shortcutRegistry) {
            expect(function () {
                shortcutRegistry.register();
            }).toThrow(new Error("Shortcut notation not correct: 'undefined'"));
        }));

        it('should create a shortcut', inject(function (shortcutRegistry) {
            var shortcut = shortcutRegistry.register("cmd+a");
            var shortcuts = shortcutRegistry.getAll();
            expect(shortcuts.length).toEqual(1);
            expect(shortcuts[0]).toEqual(angular.copy(shortcut));
        }));

        it('should register a shortcut', inject(function (shortcutRegistry, shortcutParser) {
            var shortcut = shortcutRegistry.register("cmd+a");
            expect(shortcut).toEqual(shortcutParser.parse("cmd+a"));
        }));

        it('should register a shortcut with a given action', inject(function (shortcutRegistry, shortcutParser) {
            var dummyAction = function () {
            };
            var shortcut = shortcutRegistry.register("cmd+a", dummyAction);
            expect(shortcut.action).toBe(dummyAction);
        }));
    });

    describe('shortcutRegistry.getAll', function () {
        it('should have an empty list if no shortcuts are registered', inject(function (shortcutRegistry) {
            expect(shortcutRegistry.getAll()).toEqual([]);
        }));
    });

    describe('shortcutRegistry.unregister', function () {
        it('should unregister the correct shortcut of many registered shortcuts', inject(function (shortcutRegistry, shortcutParser) {
            var copyShortcut = shortcutRegistry.register("cmd+c");
            var pasteShortcut = shortcutRegistry.register("cmd+v");
            var selectAllShortcut = shortcutRegistry.register("cmd+a");

            // unregister
            shortcutRegistry.unregister(selectAllShortcut);

            var shortcuts = shortcutRegistry.getAll();
            expect(shortcuts.length).toEqual(2);
            expect(shortcuts[0]).toEqual(angular.copy(copyShortcut));
            expect(shortcuts[1]).toEqual(angular.copy(pasteShortcut));
        }));
    });

    describe('shortcutRegistry.displayData', function () {
        it('should return an array of information about the registered shortcuts', inject(function (shortcutRegistry) {
            var shortcut = shortcutRegistry.register("cmd+a", function () {
            }, {description: "Select all elements"});

            expect(shortcutRegistry.displayData()).toEqual([
                {
                    keys: "cmd+a",
                    description: "Select all elements"
                }
            ]);
        }));
    });

    describe('shortcutRegistry', function () {
        var selectionManager, keydownEvent;

        beforeEach(function () {
            // reset keydown handlers
            jQuery(document).off("keydown");

            selectionManager = {
                selectAll: function () {

                }
            };
            // configure cmd+a
            keydownEvent = jQuery.Event("keydown");
            keydownEvent.keyCode = 65; // A
            keydownEvent.metaKey = true; // cmd

            keydownEvent.altKey = false;
            keydownEvent.ctrlKey = false;
            keydownEvent.shiftKey = false;

            keydownEvent.preventDefault = function () {
            };
            spyOn(keydownEvent, "preventDefault");

            keydownEvent.stopPropagation = function () {
            };
            spyOn(keydownEvent, "stopPropagation");

            spyOn(selectionManager, "selectAll");

        });

        it('should call the test action (selectAll) and preventDefault when "cmd+a" is triggered', inject(function (shortcutRegistry) {
            shortcutRegistry.register("cmd+a", selectionManager.selectAll);

            jQuery(document).trigger(keydownEvent);

            expect(selectionManager.selectAll).toHaveBeenCalled();
            expect(keydownEvent.preventDefault).toHaveBeenCalled();
            expect(keydownEvent.stopPropagation).not.toHaveBeenCalled();
        }));

        it('should not call preventDefault if configured', inject(function (shortcutRegistry) {
            shortcutRegistry.register("cmd+a", selectionManager.selectAll, {preventDefault: false});
            jQuery(document).trigger(keydownEvent);
            expect(keydownEvent.preventDefault).not.toHaveBeenCalled();
        }));

        it('should call stopPropagation if configured', inject(function (shortcutRegistry) {
            shortcutRegistry.register("cmd+a", selectionManager.selectAll, {stopPropagation: true});
            jQuery(document).trigger(keydownEvent);
            expect(keydownEvent.stopPropagation).toHaveBeenCalled();
        }));

        it('should not call test action (selectAll) if "cmd+b" is triggered', inject(function (shortcutRegistry) {
            shortcutRegistry.register("cmd+a", selectionManager.selectAll);

            keydownEvent.keyCode = 66;
            jQuery(document).trigger(keydownEvent);

            expect(selectionManager.selectAll).not.toHaveBeenCalled();
        }));
    });

});
