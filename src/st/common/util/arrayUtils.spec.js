/*jshint camelcase:false */
describe('service', function () {
    'use strict';
    beforeEach(module('st.common.util.arrayUtils'));

    // objects for identity / equality checks
    var x10_A = {x: 10};
    var x10_2 = {x: 10};
    var x10_3 = {x: 10};
    var x12 = {x: 12};

    describe('arrayUtils.inArray', function () {

        it('should check if an element is in an array', inject(function (arrayUtils) {
            expect(arrayUtils.inArray(0, [0, 1, 2])).toEqual(true);
        }));
        it('should check if an identical object is in an array', inject(function (arrayUtils) {
            expect(arrayUtils.inArray(x10_A, [x10_3, x10_2, x10_A, x12])).toEqual(true);
            expect(arrayUtils.inArray(x10_A, [x10_A, x10_A, x10_A, x10_A])).toEqual(true);
            expect(arrayUtils.inArray(x10_A, [x10_3, x10_2, x12])).toEqual(false);
        }));

        it('should check if an identical object is in an array', inject(function (arrayUtils) {
            // just identify but with explicit parameter
            expect(arrayUtils.inArray(x10_A, [x10_A], false)).toEqual(true);

            // equals check for identical object
            expect(arrayUtils.inArray(x10_A, [x10_A], true)).toEqual(true);

            // equals for non identical but equal objects
            expect(arrayUtils.inArray(x10_A, [x10_2], true)).toEqual(true);
            expect(arrayUtils.inArray(x10_A, [x12, x10_2, x12], true)).toEqual(true);

            // equals for non identical and non equal
            expect(arrayUtils.inArray(x10_A, [x12], true)).toEqual(false);
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
            }).toThrow(new Error('Expected an array but got undefined'));
        }));

        it('should throw an error for something else than arrays', inject(function (arrayUtils) {
            expect(function () {
                arrayUtils.checkArray({});
            }).toThrow(new Error('Expected an array but got [object Object]'));
            expect(function () {
                arrayUtils.checkArray(1);
            }).toThrow(new Error('Expected an array but got 1'));
        }));
    });

    describe('arrayUtils.extractPropertyFromArray', function () {
        var users = [
            {
                username: 'tpotthof',
                address: {
                    number: 33,
                    street: 'Adam-Karrillon-Str',
                    city: 'Mainz'
                }
            },
            {
                username: 'mlaspe',
                address: {
                    city: 'Wiesbaden'
                }
            },
            {
                username: 'jseibert',
                address: {
                    city: 'Wiesbaden'
                }
            },
            {
                username: 'bborbe',
                address: null
            }
        ];
        var usernames = ['tpotthof', 'mlaspe', 'jseibert', 'bborbe'];
        var cities = ['Mainz', 'Wiesbaden'];
        var addresses = [
            {
                number: 33,
                street: 'Adam-Karrillon-Str',
                city: 'Mainz'
            },
            {
                city: 'Wiesbaden'
            }
        ];

        it('should throw an error for undefined', inject(function (arrayUtils) {
            expect(function () {
                arrayUtils.extractPropertiesFromArray(undefined, 'x');
            }).toThrow(new Error('Expected an array but got undefined'));
        }));

        it('should throw an error for something else than arrays', inject(function (arrayUtils) {
            expect(function () {
                arrayUtils.extractPropertiesFromArray({}, 'x');
            }).toThrow(new Error('Expected an array but got [object Object]'));
            expect(function () {
                arrayUtils.extractPropertiesFromArray(1, 'x');
            }).toThrow(new Error('Expected an array but got 1'));
        }));

        it('should return an empty array for an empty array', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray([], 'x')).toEqual([]);
        }));

        it('should extract the usernames from the array', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray(users, 'username')).toEqual(usernames);
        }));

        it('should extract the cities in the address from the array', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray(users, 'address.city')).toEqual(cities);
        }));

        it('should extract the addresses from the array', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray(users, 'address')).toEqual(addresses);
        }));

        it('should return an empty array for an not existing property', inject(function (arrayUtils) {
            expect(arrayUtils.extractPropertiesFromArray(users, 'address.birthday')).toEqual([]);
        }));

    });
    describe('arrayUtils.remove', function () {

        it('should remove an equal number or string from the array', inject(function (arrayUtils) {
            expect(arrayUtils.remove(3, [5, 4, 3, 2, 1, 0])).toEqual([5, 4, 2, 1, 0]);
            expect(arrayUtils.remove(6, [5, 4, 3, 2, 1, 0])).toEqual([5, 4, 3, 2, 1, 0]);
            expect(arrayUtils.remove(5, [5, 5, 5])).toEqual([5, 5]);
            expect(arrayUtils.remove('5', [5, '5'])).toEqual([5]);
            expect(arrayUtils.remove('a', ['aaa', 'aa', 'a'])).toEqual(['aaa', 'aa']);
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
