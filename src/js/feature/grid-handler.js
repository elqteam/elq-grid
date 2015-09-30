"use strict";

module.exports = function ElqGridHandler(options) {
    var styleHandler = options.styleHandler;
    var utils = options.utils;
    var reporter = options.reporter;

    function getGridElements(root) {
        var elements = [];

        var rows = [];

        if (root.className.indexOf("elq-row") !== -1) {
            rows.push(root);
        }

        rows = rows.concat(Array.prototype.slice.call(root.getElementsByClassName("elq-row")));

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

    function isRow(element) {
        // TODO: Perhaps split classes by " " and then check so that we avoid getting matches for classes that contains elq-*.
        return element.className.indexOf("elq-row") !== -1;
    }

    function isCol(element) {
        // TODO: Perhaps split classes by " " and then check so that we avoid getting matches for classes that contains elq-*.
        return element.className.indexOf("elq-col") !== -1;
    }

    function isGridElement(element) {
        return isRow(element) || isCol(element);
    }

    function start(elq, element) {
        function elqifyColumnElement(rowElement, element) {
            element.setAttribute("elq", "");
            element.setAttribute("elq-mirror", "");
            elq.pluginHandler.get("elq-mirror").mirror(element, rowElement);
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

        if (isRow(element)) {
            // All elq-row elements need to detect resizes and also update breakpoints.
            element.elq.resizeDetection = true;
            element.elq.updateBreakpoints = true;

            // Enable serialization unless some other system explicitly has disabled it.
            if (element.elq.serialize !== false) {
                element.elq.serialize = true;
            }

            // Disable cycle checks since the API for elq-grids prevents cycles (unless developer error).
            element.elq.cycleCheck = false;

            // All children of a row should be converted to elq-mirror objects.
            for (var i = 0; i < element.children.length; i++) {
                var child = element.children[i];
                if (child.className.indexOf("elq-col") >= 0) {
                    elqifyColumnElement(element, child);
                }
            }
        } else if (isCol(element)) {
            if (!isRow(element.parentElement)) {
                reporter.warn("elq-col elements without an elq-row parent is currently unsupported.");
            }
            //elqifyRowElement(row, breakpoints);
        } else {
            return;
        }
    }

    function getBreakpoints(element) {
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

        if (!isRow(element)) {
            return;
        }

        var columns = [];
        var children = element.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.className.indexOf("elq-col") >= 0) {
                columns.push(child);
            }
        }

        var classes = columns.reduce(function (allClasses, column) {
            return allClasses.concat(getClasses(column));
        }, []);

        var breakpoints = getBreakpoints(classes);

        styleHandler.applyGridStyles(breakpoints);

        breakpoints = breakpoints.map(function (bp) {
            return {
                dimension: "width",
                pixelValue: bp,
                value: bp,
                type: "px"
            };
        });


        return breakpoints;
    }

    return {
        start: start,
        getBreakpoints: getBreakpoints
    };
};