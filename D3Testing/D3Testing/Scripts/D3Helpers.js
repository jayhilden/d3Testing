"use strict";
var projection = d3.geo.mercator();

function Coordinate(x, y) {
    var c = [x, y];
    return {
        x: {
            valueOf: function () {
                var p = projection(c);
                return p[0];
            }
        },
        y: {
            valueOf: function () {
                var p = projection(c);
                return p[1];
            }
        },
        projection: function () {
            return projection(c);
        }
    }
}
