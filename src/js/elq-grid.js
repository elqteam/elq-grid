"use strict";

module.exports = function ElqGrid(options) {
    function start(elements) {
        function getClasses(elements) {
            var classes = [];
            var columnRegex = /elq[-]col[-]\d+[-]\d\d?/g;

            for (var i = 0; i < elements.length; i++) {
                var className = elements[i].className;
                var matches = className.match(columnRegex) || [];
                classes = classes.concat(matches);
            }

            classes = classes.filter(function onlyUnique(value, index) {
                return classes.indexOf(value) === index;
            });

            return classes;
        }

        function getClassesInformation(classes) {
            return classes.map(function (c) {
                var parts = c.split("-");
                var breakpoint = parseInt(parts[2], 10);
                var column = parseInt(parts[3], 10);

                return {
                    breakpoint: breakpoint,
                    column: column,
                    class: c
                };
            });
        }

        function generateColumnStyleString(classesInformation) {
            var style = "";

            classesInformation.forEach(function (ci) {
                var width = Math.round(ci.column/12 * 10000000000) / 100000000;

                style += "\n";
                style += ".elq-min-width-" + ci.breakpoint + "." + ci.class + " {\n";
                style += "    width: " + width + "%;\n";
                style += "}\n";
            });

            return style;
        }

        function injectStyle(style) {
            var styleElement = document.createElement("style");
            styleElement.innerHTML = style;
            document.head.appendChild(styleElement);
        }

        function elqifyElements(elements) {
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];

                if (element.className.indexOf("elq-col") >= 0) {
                    element.setAttribute("elq", "");
                    element.setAttribute("elq-mirror", "");
                } else if (element.className.indexOf("elq-row") >= 0) {
                    var classes = getClasses(element.children);
                    var classesInformation = getClassesInformation(classes);
                    var widthBreakpoints = "";

                    classesInformation.forEach(function (ci) {
                        widthBreakpoints += ci.breakpoint + " ";
                    });

                    widthBreakpoints = widthBreakpoints.trim();

                    element.setAttribute("elq", "");
                    element.setAttribute("elq-breakpoints", "");
                    element.setAttribute("elq-breakpoints-widths", widthBreakpoints);
                }
            }
        }

        var classes = getClasses(elements);
        var classesInformation = getClassesInformation(classes);

        classesInformation = classesInformation.sort(function (a, b) {
            var value = a.breakpoint - b.breakpoint;

            if (value === 0) {
                return a.column - b.column;
            }

            return value;
        });

        var style = generateColumnStyleString(classesInformation);
        injectStyle(style);

        elqifyElements(elements);
    }

    return {
        start: start
    };
};