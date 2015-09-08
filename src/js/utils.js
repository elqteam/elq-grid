"use strict";

var utils = module.exports = {};

utils.getClassesByRegexp = function (element, regexp) {
    var classes = [];

    var className = element.className;
    var matches = className.match(regexp) || [];
    classes = classes.concat(matches);

    return classes;
};

utils.unique = function (array) {
    return array.filter(function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    })
};

utils.sortNumbers = function (array) {
    return array.sort(function (a, b) {
        return a - b;
    });
};