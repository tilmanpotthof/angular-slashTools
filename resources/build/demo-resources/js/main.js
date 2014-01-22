angular.module("slashToolsDemo", ["st.common", "st.shortcuts"]);

angular.module("slashToolsDemo").controller("shortcutDemoController", function ($scope) {
    $scope.box = {
        isHidden : false,
        show : function () {
            this.isHidden = false;
        },
        hide: function () {
            this.isHidden = true;
        },
        toggle: function () {
            this.isHidden = !this.isHidden;
        }
    }
})