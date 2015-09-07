"use strict";

var StyleHandler = require("./style-handler.js");

module.exports = function ElqGrid(options) {
    var styleHandler = StyleHandler();

    function start(elements) {
        function getClasses(elements) {
            var classes = [];
            var columnRegex = /elq[-]col[-]\d+[-]\d\d?/g;

            for (var i = 0; i < elements.length; i++) {
                var className = elements[i].className;
                var matches = className.match(columnRegex) || [];
                classes = classes.concat(matches);
            }

            return classes;
        }

        function getBreakpoints(classes) {
            return classes.map(function (c) {
                var parts = c.split("-");
                var breakpoint = parseInt(parts[2], 10);
                return breakpoint;
            }).filter(function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            });
        }

        function elqifyElements(elements) {
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];

                if (element.className.indexOf("elq-col") >= 0) {
                    element.setAttribute("elq", "");
                    element.setAttribute("elq-mirror", "");
                } else if (element.className.indexOf("elq-row") >= 0) {
                    var classes = getClasses(element.children);
                    var breakpoints = getBreakpoints(classes);
                    var widthBreakpoints = "";

                    breakpoints.forEach(function (breakpoint) {
                        widthBreakpoints += breakpoint + " ";
                    });

                    widthBreakpoints = widthBreakpoints.trim();

                    element.setAttribute("elq", "");
                    element.setAttribute("elq-breakpoints", "");
                    element.setAttribute("elq-breakpoints-widths", widthBreakpoints);
                }
            }
        }

        var classes = getClasses(elements);
        var breakpoints = getBreakpoints(classes);

        breakpoints = breakpoints.sort(function (a, b) {
            return a - b;
        });

        styleHandler.applyStyles(breakpoints);
        elqifyElements(elements);
    }

    return {
        start: start
    };
};