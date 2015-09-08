"use strict";

module.exports = function ElqGridHandler(options) {
    var styleHandler = options.styleHandler;
    var utils = options.utils;

    function start(root) {
        function getClasses(element) {
            var regexp = /elq\-col\-\d+\-\d\d?/g;
            return utils.getClassesByRegexp(element, regexp);
        }

        function getBreakpoints(classes) {
            return utils.unique(classes.map(function (c) {
                var parts = c.split("-");
                var breakpoint = parseInt(parts[2], 10);
                return breakpoint;
            }));
        }

        function elqifyColumnElement(element) {
            element.setAttribute("elq", "");
            element.setAttribute("elq-mirror", "");
        }

        function elqifyRowElement(element, breakpoints) {
            var widthBreakpoints = breakpoints.reduce(function (acc, breakpoint) {
                return acc + breakpoint + " ";
            }, "");

            widthBreakpoints = widthBreakpoints.trim();

            element.setAttribute("elq", "");
            element.setAttribute("elq-breakpoints", "");
            element.setAttribute("elq-breakpoints-widths", widthBreakpoints);
        }

        function getGridElements(root) {
            var elements = [];

            var rows = root.getElementsByClassName("elq-row");

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];

                var columns = [];
                var children = row.children;
                for (var j = 0; j < children.length; j++) {
                    var child = children[j];
                    if (child.className.indexOf("elq-col") >= 0) {
                        columns.push(child);
                    }
                }

                elements.push({
                    row: row,
                    columns: columns
                });
            }

            return elements;
        }

        var gridsElements = getGridElements(root);

        var allBreakpoints = [];

        gridsElements.forEach(function (gridElement) {
            var row = gridElement.row;
            var columns = gridElement.columns;

            var classes = columns.reduce(function (allClasses, column) {
                return allClasses.concat(getClasses(column));
            }, []);
            

            var breakpoints = utils.sortNumbers(getBreakpoints(classes));

            elqifyRowElement(row, breakpoints);
            columns.forEach(elqifyColumnElement);

            allBreakpoints = allBreakpoints.concat(breakpoints);
        });

        allBreakpoints = utils.unique(allBreakpoints).sort(function (a, b) {
            var diff = a.breakpoint - b.breakpoint;

            if (diff === 0) {
                //TODO: Second sorting on hidden or visible?
            }

            return diff;
        });

        styleHandler.applyGridStyles(allBreakpoints);
    }

    return {
        start: start
    };
};