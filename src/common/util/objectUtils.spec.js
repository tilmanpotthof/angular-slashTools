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
