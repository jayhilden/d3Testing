function coord(x, y) {
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
        }
    }
}

function initItemHilden(d) {
    //debugger;
    d.eventDate = Date.parse(d['Event Date']);
    d.fromCoord = coord(d['From Latitude'], d['From Longitude']);
    d.toCoord = coord(d['To Latitude'], d['To Longitude']);
    d.movementDays = parseInt(d['Duration Of Movement In Days']);
    //d.value = d.movementDays;//this is so we can do things like min/max calculations
    //d.valueOf = d.value;//this is so we can do things like min/max calculations
    d.daysAtDestination = parseInt(d['Days At Destination']);
    return d;
}