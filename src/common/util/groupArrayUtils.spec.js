describe('service', function () {
    'use strict';
    beforeEach(module('st.common.util.groupArrayUtils'));

    describe('groupArrayUtils.group', function () {
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

        var groupedByCompany = [
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
        ];
        it('should group users in an array by company', inject(function (groupArrayUtils) {
            var grouped = groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});
            expect(grouped[0]).toEqual(groupedByCompany[0]);
            expect(grouped[1]).toEqual(groupedByCompany[1]);
            expect(grouped[2]).toEqual(groupedByCompany[2]);
            expect(grouped[3]).toEqual(groupedByCompany[3]);
            expect(grouped).toEqual(groupedByCompany);
        }));

        var groupedByCity = [
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
        ];


        it('should group users in an array by city', inject(function (groupArrayUtils) {
            var grouped = groupArrayUtils.group(users, {by: "address.city", as: "city", in: "usersForCity"});
            expect(grouped[0]).toEqual(groupedByCity[0]);
            expect(grouped[1]).toEqual(groupedByCity[1]);
            expect(grouped[2]).toEqual(groupedByCity[2]);
            expect(grouped).toEqual(groupedByCity);
        }));




        it('should group the documentation example as specified', inject(function (groupArrayUtils) {
            var users = [
                {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
                {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"},
                {username: "dcrockford", company: "Paypal Inc."}
            ];
            var result = groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});
            var expectedResult = [{
                company: "//SEIBERT/MEDIA GmbH",
                usersForCompany: [
                    {username: "tpotthof", company: "//SEIBERT/MEDIA GmbH"},
                    {username: "mclasen", company: "//SEIBERT/MEDIA GmbH"}
                ]
            },{
                company: "Paypal Inc.",
                usersForCompany: [
                    {username: "dcrockford", company: "Paypal Inc."}
                ]
            }];
            expect(result).toEqual(expectedResult);
        }));
    });

});
