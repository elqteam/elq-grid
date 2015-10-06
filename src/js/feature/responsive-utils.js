"use strict";

module.exports = function ElqGridHandler(options) {
    var styleHandler = options.styleHandler;
    var utils = options.utils;

    function isUtilElement(element) {
        return element.className.indexOf("elq-hidden") !== -1;
    }

    function isUtilParentElement(element) {
        return element.elq && element.elq.responsiveUtils && element.elq.responsiveUtils.parent;
    }

    function getExtraElements(element) {
        if (!isUtilElement(element)) {
            return;
        }

        return [element.parentElement];
    }

    function start(elq, element) {
        if (!isUtilElement(element)) {
            return;
        }

        var parent = element.parentElement;

        // Parent of elq-hidden elements need to detect resizes and also update breakpoints.
        parent.elq.resizeDetection = true;
        parent.elq.updateBreakpoints = true;

        // Disable serialization unless some other system explicitly has enabled it.
        if (parent.elq.serialize !== true) {
            parent.elq.serialize = false;
        }

        // Cannot disable cycle checks since the API does not enforce any structure of the parent element.

        // Mark the parent so that we can filter out non-parent utils elements in getBreakpoints.
        parent.elq.responsiveUtils = {
            parent: true
        };

        // The elq-hidden element should mirror the parent.
        elq.pluginHandler.get("elq-mirror").mirror(element, parent);
    }

    function getBreakpoints(element) {
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

        if (!isUtilParentElement(element)) {
            return [];
        }

        var classes = [];
        for(var i = 0; i < element.children.length; i++) {
            var child = element.children[i];

            if (isUtilElement(child)) {
                classes.push.apply(classes, getClasses(child));
            }
        }

        var breakpoints = getBreakpoints(classes);
        breakpoints = utils.sortNumbers(breakpoints);

        styleHandler.applyResponsiveUtilsStyles(breakpoints);

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
        getBreakpoints: getBreakpoints,
        getExtraElements: getExtraElements
    };
};