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

        it('should create a shortcut', inject(function (shortcutRegistry, shortcutParser) {
            var shortcut = shortcutRegistry.register("cmd+a");
            var shortcuts = shortcutRegistry.getAll();
            expect(shortcuts.length).toEqual(1);
            expect(shortcuts).toEqual([shortcut]);
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
            expect(shortcuts).toEqual([copyShortcut, pasteShortcut]);
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
