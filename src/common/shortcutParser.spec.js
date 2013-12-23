'use strict';
/*global describe, beforEach */

/* jasmine specs for services go here */

describe('service', function () {
    beforeEach(module('st.common.shortcutParser'));

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
