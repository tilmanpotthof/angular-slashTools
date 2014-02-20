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
