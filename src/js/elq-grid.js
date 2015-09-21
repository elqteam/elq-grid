"use strict";

var StyleHandler = require("./style-handler.js");
var utils = require("./utils.js");
var GridHandler = require("./feature/grid-handler.js");
var ResponsiveUtilsHandler = require("./feature/responsive-utils.js");

module.exports = function ElqGrid(options) {
    var styleHandler = StyleHandler({
        utils: utils
    });
    var gridHandler = GridHandler({
        styleHandler: styleHandler,
        utils: utils
    });
    var responsiveUtilsHandler = ResponsiveUtilsHandler({
        styleHandler: styleHandler,
        utils: utils
    });

    function start(root) {
        root = root || document;

        // Support jQyery-like DOM-wrappers.
        if (root.length) {
            root = root[0];
        }

        gridHandler.start(root);
        responsiveUtilsHandler.start(root);
    }

    return {
        start: start
    };
};