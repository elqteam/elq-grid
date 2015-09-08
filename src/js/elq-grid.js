"use strict";

var StyleHandler = require("./style-handler.js");
var utils = require("./utils.js");
var GridHandler = require("./feature/grid-handler.js");

module.exports = function ElqGrid(options) {
    var styleHandler = StyleHandler();
    var gridHandler = GridHandler({
        styleHandler: styleHandler,
        utils: utils
    });

    function start(root) {
        root = root || document;

        gridHandler.start(root);
    }

    return {
        start: start
    };
};