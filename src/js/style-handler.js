"use strict";

module.exports = function StyleHandler() {
    var breakpointStyleElements = {};

    function applyGridStyles(breakpoints) {
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

    function applyUtilityStyles(breakpoints) {
        function getColumnsStyleString(breakpoint) {
            var elqBreakpoint = ".elq-min-width-" + breakpoint;

            var style = "";

            style += ".elq-visible-" + breakpoint + " { display: none !important; }";
            style += elqBreakpoint + ".elq-visible-" + breakpoint + " { display: block !important; }";
            style += ".table" + elqBreakpoint + ".elq-visible-" + breakpoint + " { display: table !important; }";
            style += ".tr" + elqBreakpoint + ".elq-visible-" + breakpoint + " { display: table-row !important; }";
            style += ".th" + elqBreakpoint + ".elq-visible-" + breakpoint + " { display: table-cell !important; }";
            style += ".td" + elqBreakpoint + ".elq-visible-" + breakpoint + " { display: table-cell !important; }";

            return style;
        }
    }

    return {
        applyGridStyles: applyGridStyles,
        applyUtilityStyles: applyUtilityStyles
    };
};