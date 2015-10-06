"use strict";

var packageJson = require("../../package.json");
var StyleHandler = require("./style-handler.js");
var utils = require("./utils.js");
var GridHandler = require("./feature/grid-handler.js");
var ResponsiveUtilsHandler = require("./feature/responsive-utils.js");

module.exports = {
    getName: function () {
        return "elq-grid";
    },
    getVersion: function () {
        return packageJson.version;
    },
    isCompatible: function (elq) {
        return parseInt(elq.getVersion().split(".")[1]) === 3;
    },
    make: function (elq, options) {
        var styleHandler = StyleHandler({
            utils: utils
        });
        var gridHandler = GridHandler({
            styleHandler: styleHandler,
            utils: utils,
            reporter: elq.reporter
        });
        var responsiveUtilsHandler = ResponsiveUtilsHandler({
            styleHandler: styleHandler,
            utils: utils
        });

        function getExtraElements(element) {
            return responsiveUtilsHandler.getExtraElements(element);
        }

        function start(element) {
            gridHandler.start(elq, element);
            responsiveUtilsHandler.start(elq, element);
        }

        function getBreakpoints(element) {
            var breakpoints = [];

            breakpoints = breakpoints.concat(gridHandler.getBreakpoints(element) || []);
            breakpoints = breakpoints.concat(responsiveUtilsHandler.getBreakpoints(element) || []);

            return breakpoints;
        }

        return {
            start: start,
            getBreakpoints: getBreakpoints,
            getExtraElements: getExtraElements
        };
    }
};
