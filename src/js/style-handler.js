"use strict";

module.exports = function StyleHandler() {
    var breakpointStyleElements = {};

    function applyStyles(breakpoints) {
        function getColumnsStyleString(breakpoint) {
            var style = "";

            for (var i = 1; i <= 12; i++) {
                var width = Math.round(i/12 * 10000000000) / 100000000;
                var columnClass = ".elq-col-" + breakpoint + "-" + i;
                var elqBreakpoint = ".elq-min-width-" + breakpoint;

                style += "\n";
                style += elqBreakpoint + columnClass + " {\n";
                style += "    width: " + width + "%;\n";
                style += "}\n";
            }

            return style;
        }

        function injectStyle(style) {
            var styleElement = document.createElement("style");
            styleElement.innerHTML = style;
            document.head.appendChild(styleElement);
            return styleElement;
        }

        breakpoints.forEach(function (breakpoint) {
            if (!breakpointStyleElements[breakpoint]) {
                var columnsStyleString = getColumnsStyleString(breakpoint);
                breakpointStyleElements[breakpoint] = injectStyle(columnsStyleString);
            }
        });
    }

    return {
        applyStyles: applyStyles
    };
};