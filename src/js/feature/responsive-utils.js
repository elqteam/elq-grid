"use strict";

module.exports = function ElqGridHandler(options) {
    var styleHandler = options.styleHandler;
    var utils = options.utils;

    function start(root) {
        function getClasses(element) {
            var regexp = /elq\-hidden\-\d+\-(down|up)/g;
            return utils.getClassesByRegexp(element, regexp);
        }

        function getBreakpoints(classes) {
            return utils.unique(classes.map(function (c) {
                var parts = c.split("-");
                var breakpoint = parseInt(parts[2], 10);
                return breakpoint;
            }));
        }

        function elqifyElement(element, breakpoints) {
            var widthBreakpoints = breakpoints.reduce(function (acc, breakpoint) {
                return acc + breakpoint + " ";
            }, "");

            widthBreakpoints = widthBreakpoints.trim();

            element.setAttribute("elq", "");
            element.setAttribute("elq-mirror", "");

            var parent = element.parentElement;
            var parentBreakpoints = parent.getAttribute("elq-breakpoints-widths");
            var parentBreakpointsString = widthBreakpoints;
            var options = "";

            if (parentBreakpoints) {
                parentBreakpoints = parentBreakpoints.split(" ").map(function (bp) {
                    return parseInt(bp, 10);
                });

                var mergedBreakpoints = utils.sortNumbers(utils.unique(parentBreakpoints.concat(breakpoints)));
                parentBreakpointsString = mergedBreakpoints.reduce(function (acc, breakpoint) {
                    return acc + breakpoint + " ";
                }, "").trim();

                options = parent.getAttribute("elq-breakpoints");
            } else {
                options += "noclasses ";
            }

            options = options.trim();

            parent.setAttribute("elq", "");
            parent.setAttribute("elq-breakpoints", options);
            parent.setAttribute("elq-breakpoints-widths", parentBreakpointsString);
        }

        var elements = Array.prototype.slice.call(root.querySelectorAll("[class^=elq-hidden]"));
        
        var allBreakpoints = [];

        elements.forEach(function (element) {
            var classes = getClasses(element);

            var breakpoints = getBreakpoints(classes);
            breakpoints = utils.sortNumbers(breakpoints);
            elqifyElement(element, breakpoints);
            allBreakpoints = allBreakpoints.concat(breakpoints);
        });

        allBreakpoints = utils.sortNumbers(utils.unique(allBreakpoints));

        styleHandler.applyResponsiveUtilsStyles(allBreakpoints);
    }

    return {
        start: start
    };
};