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
        function startBreakpointElement(element) {
            // All elq-row elements need to detect resizes and also update breakpoints.
            element.elq.resizeDetection = true;
            element.elq.updateBreakpoints = true;

            // Disable serialization unless some other system explicitly has enabled it.
            if (element.elq.serialize !== true) {
                element.elq.serialize = false;
            }
        }

        if (isRow(element)) {
            startBreakpointElement(element);

            // Disable cycle checks since the API for elq-grids prevents cycles (unless developer error).
            element.elq.cycleCheck = false;

            // All children of a row should be converted to elq-mirror elements that mirror the row element.
            for (var i = 0; i < element.children.length; i++) {
                var child = element.children[i];
                if (isCol(child) >= 0) {
                    elq.pluginHandler.get("elq-mirror").mirror(child, element);
                }
            }
        } else if (isCol(element)) {
            var parent = element.parentElement;

            if (!isRow(parent)) {
                // elq-col elements do not need to be directly children of an elq-row element.
                // Free elq-col elements should depend on the parent.
                startBreakpointElement(parent);

                // Cannot disable cycle checks since the API does not enforce any structure of the parent element.

                elq.pluginHandler.get("elq-mirror").mirror(element, parent);
            }
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