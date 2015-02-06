"use strict";
var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection);
var zoom = d3.behavior.zoom()
    .on("zoom", function () {
        projection.translate(d3.event.translate).scale(d3.event.scale);
        feature.attr("d", path);
        circle.attr("transform", ctr);
    });

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
