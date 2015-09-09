"use strict";

module.exports = function StyleHandler() {
    var gridBreakpointStyleElements = {};
    var utilsBreakpointStyleElements = {};

    function injectStyle(style) {
        var styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
        return styleElement;
    }

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

        breakpoints.forEach(function (breakpoint) {
            if (!gridBreakpointStyleElements[breakpoint]) {
                var columnsStyleString = getColumnsStyleString(breakpoint);
                gridBreakpointStyleElements[breakpoint] = injectStyle(columnsStyleString);
            }
        });
    }

    function applyResponsiveUtilsStyles(breakpoints) {
        function getStyleString(breakpoint) {
            var style = "";

            style += ".elq-min-width-" + breakpoint + ".elq-hidden-" + breakpoint + "-up { display: none !important; }\n";
            style += ".elq-max-width-" + breakpoint + ".elq-hidden-" + breakpoint + "-down { display: none !important; }";

            return style;
        }

        breakpoints.forEach(function (breakpoint) {
            if (!utilsBreakpointStyleElements[breakpoint]) {
                var styleString = getStyleString(breakpoint);
                utilsBreakpointStyleElements[breakpoint] = injectStyle(styleString);
            }
        });
    }

    return {
        applyGridStyles: applyGridStyles,
        applyResponsiveUtilsStyles: applyResponsiveUtilsStyles
    };
};