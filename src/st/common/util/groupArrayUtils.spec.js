describe('service', function () {
    'use strict';
    beforeEach(module('st.common.util.groupArrayUtils'));

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

    // Nested group
    var groupedByCompanyAndCity = [
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
    ];

    describe('groupArrayUtils.group', function () {

        it('should group users in an array by company', inject(function (groupArrayUtils) {
            var grouped = groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});
            expect(grouped[0]).toEqual(groupedByCompany[0]);
            expect(grouped[1]).toEqual(groupedByCompany[1]);
            expect(grouped[2]).toEqual(groupedByCompany[2]);
            expect(grouped[3]).toEqual(groupedByCompany[3]);
            expect(grouped).toEqual(groupedByCompany);
        }));

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
            var expectedResult = [
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
            ];
            expect(result).toEqual(expectedResult);
        }));


        it('should group array with nested definitions', inject(function (groupArrayUtils) {
            var result = groupArrayUtils.group(users, {by: "company", in: "usersForCompany"});
            result.forEach(function (users) {
                users.usersForCompany = groupArrayUtils.group(users.usersForCompany, {by: "address.city", as: "city", in: "usersForCity"});
            });
            expect(result[0]).toEqual(groupedByCompanyAndCity[0]);
            expect(result[1]).toEqual(groupedByCompanyAndCity[1]);
            expect(result[2]).toEqual(groupedByCompanyAndCity[2]);
            expect(result[3]).toEqual(groupedByCompanyAndCity[3]);
            expect(result).toEqual(groupedByCompanyAndCity);
        }));

        it('should group the array with multiple definitions', inject(function (groupArrayUtils) {
            var result = groupArrayUtils.group(users, [
                {by: "company", in: "usersForCompany"},
                {by: "address.city", as: "city", in: "usersForCity"}
            ]);

            expect(result).toEqual(groupedByCompanyAndCity);
        }));
    });
});
