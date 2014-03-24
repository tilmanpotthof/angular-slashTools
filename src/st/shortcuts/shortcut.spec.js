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
