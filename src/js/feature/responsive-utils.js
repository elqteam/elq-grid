"use strict";

module.exports = function ElqGridHandler(options) {
    var styleHandler = options.styleHandler;
    var utils = options.utils;

    function start(elements) {
        function getClasses(element) {
            var regexp = /elq\-hidden\-\d+\-(down|up)/g;
            return utils.getClassesByRegexp(element, regexp);
        }

        function getBreakpoints(classes) {
            return utils.unique(classes.map(function (c) {
                var parts = c.split("-");
                var breakpoint = parseInt(parts[2], 10);
                return {
                    breakpoint: breakpoint,
                    direction: parts[3]
                };
            }));
        }

        function elqifyElements(elements) {
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];

                if (element.className.indexOf("elq-hidden") >= 0) {
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

        breakpoints = utils.sortNumbers(breakpoints);

        styleHandler.applyGridStyles(breakpoints);
        elqifyElements(elements);
    }

    return {
        start: start
    };
};