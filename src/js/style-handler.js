"use strict";

module.exports = function StyleHandler(options) {
    var utils = options.utils;

    var gridBreakpoints = [];
    var gridBreakpointStyleElements = {};
    var utilsBreakpointStyleElements = {};
    var utilsBreakpoints = [];

    function injectStyle(style, method) {
        method = method || function (element) {
            document.head.appendChild(element);
        };

        var styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        method(styleElement);
        return styleElement;
    }

    function injectStyleAfterElement(style, element) {
        return injectStyle(style, function (styleElement) {
            document.head.insertBefore(styleElement, element.nextSibling);
        });
    }

    function injectStyleBeforeElement(style, element) {
        return injectStyle(style, function (styleElement) {
            document.head.insertBefore(styleElement, element);
        });
    }

    function applyBreakpointStyle(breakpointElements, breakpoints, breakpoint, styleString, injectFirstStyle) {
        if (!breakpointElements[breakpoint]) {
            var directlyLesserIndex = -1;
            var directlyGreaterIndex = -1;

            for (var i = breakpoints.length - 1; i >= 0; i--) {
                if (breakpoints[i] < breakpoint) {
                    directlyLesserIndex = i;
                    break;
                }
            }

            if (directlyLesserIndex + 1 < breakpoints.length) {
                directlyGreaterIndex = directlyLesserIndex + 1;
            }

            var injectedElement;

            if (directlyLesserIndex >= 0) {
                var directlyLesserElement = breakpointElements[breakpoints[directlyLesserIndex]];
                injectedElement = injectStyleAfterElement(styleString, directlyLesserElement);
                breakpoints.splice(directlyLesserIndex + 1, 0, breakpoint);
            } else if (directlyGreaterIndex >= 0) {
                var directlyGreaterElement = breakpointElements[breakpoints[directlyGreaterIndex]];
                injectedElement = injectStyleBeforeElement(styleString, directlyGreaterElement);
                breakpoints.splice(directlyGreaterIndex, 0, breakpoint);
            } else {
                injectedElement = injectFirstStyle(styleString);
                breakpoints.push(breakpoint);
            }

            breakpointElements[breakpoint] = injectedElement;
        }
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
            applyBreakpointStyle(gridBreakpointStyleElements, gridBreakpoints, breakpoint, getColumnsStyleString(breakpoint), function injectFirstStyle(style) {
                if (utilsBreakpoints.length) {
                    var firstUtilsElement = utilsBreakpointStyleElements[utilsBreakpoints[0]];
                    return injectStyleBeforeElement(style, firstUtilsElement);
                } else {
                    return injectStyle(style);
                }
            });
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
            applyBreakpointStyle(utilsBreakpointStyleElements, utilsBreakpoints, breakpoint, getStyleString(breakpoint), function injectFirstStyle(style) {
                if (gridBreakpoints.length) {
                    var lastGridElement = gridBreakpointStyleElements[gridBreakpoints[gridBreakpoints.length - 1]];
                    return injectStyleAfterElement(style, lastGridElement);
                } else {
                    return injectStyle(style);
                }
            });
        });
    }

    return {
        applyGridStyles: applyGridStyles,
        applyResponsiveUtilsStyles: applyResponsiveUtilsStyles
    };
};