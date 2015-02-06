"use strict";
(function () {
    var w,
        h,
        _data,
        fy = 'Hilden',
        div;

    wbc.getByIsoId = function (id) {
        var c,
            l = wbc[1].length;
        while (--l > -1) {
            c = wbc[1][l];
            if (c.iso2Code == id)
                return c;
        }
        return null;
    };

    var countriesCounter = 0,
        countries = {},
        countryByIndex = [],
        failCountryCoord,
        needPaintCapital = [],
        projects;

    function preload(d) {
        if (!d)
            return;
        d.img = new Image();
        d.img.onerror = (function (img) {
            return function () {
                console.log('error load url:' + d.img.src);
                d.img = null;
            }
        })(d);
        debugger;
        d.img.src = "flags/" + d.key.toLowerCase() + '.png';
    }



    // return object country
    function initCounty(key, value) {
        var c = countries[key] || (countries[key] = {
            key: key,
            name: value,
            shortName: value.split(',')[0],
            borrowed: 0,
            supplied: 0,
            id: countriesCounter++,
            toString: function (full) {
                return full ? this.name : this.shortName;
            }
        });
        if (!countryByIndex[c.id]) {
            var cc = wbc.getByIsoId(c.key);
            if (!cc) {
                cc = failCountryCoord[c.key];
                if (!cc) {
                    cc = {
                        longitude: -50 + (10 * failCountryCoord.length++),
                        latitude: 80,
                        capitalCity: c.shortName
                    };
                    failCountryCoord[c.key] = cc;
                }
            }
            cc.init = true;
            c.capitalCity = {
                name: cc.capitalCity,
                coord: coord(cc.longitude, cc.latitude)
            };
            c.x = c.capitalCity.coord.x;
            c.y = c.capitalCity.coord.y;

            needPaintCapital.push(cc);

            preload(c);
        }
        return countryByIndex[c.id] = c;
    }


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
            },
            projection: function() {
                return projection(c);
            }
        }
    }



    /*
d is a row of data from the csv file, pretty cool.
d.csv is similar to PHP's Explode method
*/
    /*
    function initItem(d) {
        // Convert strings to numbers.
        d.value = d.basevalue = parseInt(d["Total Contract Amount (USD)"].substring(1));
        d.valueOf = value;

        d.borrower = initCounty(d["Borrower Country Code"], d["Borrower Country"]);
        d.borrower.borrowed += d.value;
        d.supplier = initCounty(d["Supplier Country Code"], d["Supplier Country"]);
        d.supplier.supplied += d.value;
        d.sector = d["Major Sector"];
        d.product = d['Product line'];
        d.procurement = {
            category: d['Procurement Category'],
            method: d['Procurement Method'],
            type: d['Procurement Type']
        };
        d.contract = {
            desc: d['Contract Description'],
            date: Date.parse(d['Contract Signing Date'])
        };
        d.year = d['Fiscal Year'];
        d.project = initProject(d);
        d.id = d['WB Contract Number'] + d.project.id + d.supplier.key + d.borrower.key;
        d.date = d.contract.date;
        d.asdate = Date.parse(d['As of Date']);

        return d;
    }
    */


    function clone(d) {
        var newItem = {};

        for (var key in d) {
            if (!d.hasOwnProperty(key))
                continue;
            newItem[key] = d[key];
        }
        return newItem;
    }

    var sizes = d3.scale.linear().range([4, 400]);

    var projection = d3.geo.mercator();

    var path = d3.geo.path()
        .projection(projection);

    function ctr(coord) {
        var proj = coord.projection();
        //debugger;
        return "translate(" + proj + ")";
    }

    var zoom = d3.behavior.zoom()
        .on("zoom", function () {
            projection.translate(d3.event.translate).scale(d3.event.scale);
            feature.attr("d", path);
            circle.attr("transform", ctr);
        });

    var fsvg = d3.select(document.body)
        .append("div")
        .attr("id", "map")
        .append("svg");

    var feature = fsvg
        .selectAll("path.feature");

    var circle;

    function initItemHilden(d) {
        //debugger;
        d.eventDate = Date.parse(d['Event Date']);
        d.fromCoord = coord(d['From Longitude'], d['From Latitude']);
        d.toCoord = coord(d['To Longitude'], d['To Latitude']);
        d.movementDays = parseInt(d['Duration Of Movement In Days']);
        //d.value = d.movementDays;//this is so we can do things like min/max calculations
        //d.valueOf = d.value;//this is so we can do things like min/max calculations
        d.daysAtDestination = parseInt(d['Days At Destination']);
        d.fromID = parseInt(d['From Unique ID']);
        d.toID = parseInt(d['To Unique ID']);

        //var x = d.fromCoord.x;
        //var y = d.fromCoord.y;
        //debugger;
        needPaintCapital.push(d.fromCoord);
        needPaintCapital.push(d.toCoord);

        //preload(d);
        return d;
    }

    function request(error, data) {
        var l, a, b;
        projects = {};
        countriesCounter = 0;
        countries = {};
        countryByIndex = [];
        failCountryCoord = { length: 0 };
        needPaintCapital = [];
        data = data.map(initItemHilden);
        //data = data.map(initItem);
        l = data.length;
        //d3.extent Returns the minimum and maximum value in the given array using natural order. This is equivalent to calling d3.min and d3.max simultaneously.
        var minMaxValues = d3.extent(data, function (d) { return d.movementDays; });

        sizes.domain(minMaxValues);

        _data = [];
        while (--l > -1) {
            a = data[l];
            var duration = a.movementDays;
            a.size = sizes(duration);
            /*
            b = clone(a);
            //a.parent = a.supplier;
            //b.parent = b.borrower;
            _data.push(b);
            */
            a.eventDate = a.eventDate - stepDate /*/2*/;
            _data.push(a);
            
        }

        div = div || d3.select(document.body).append("div").attr("id", "c");
        w = document.body.clientWidth;
        h = document.body.clientHeight;

        projection
            .scale(w / 6.5)
            .translate([w / 2, h / 1.6]);

        zoom.translate(projection.translate())
            .scale(projection.scale())
            .scaleExtent([h / 6, h]);

        feature.attr("d", path);

        fsvg.selectAll("circle").remove();
        

        circle = fsvg.selectAll("circle")
            .data(needPaintCapital)
            .enter()
            .append("circle")
            .attr("r", 1)
            .attr("fill", "#fff")
            .attr("transform", ctr);

        vis.pb = vis.pb || (
            d3.select(document.body)
                .append("div")
                .attr("id", "pb")
                .style("height", "18px")
                .append("svg")
                .attr("width", w)
                .attr("height", 18)
                .append("g")
                .call(d3.helper.progressbar)
        );

        vis.pb.width(w).height(18).textPosition("middle").max(0);

        imgPreloader.hide();

        setting.zoom = zoom;
        //debugger;
        vis.runShow(_data, div, w, h, setting);
        btnPause.show();
        btnStop.show();
        //vis.stopShow();
    }

    d3.select("#chHisto").on("change", function (d) {
        setting.showHistogram = this.checked;
    });

    d3.select("#chLeg").on("change", function (d) {
        setting.showCountExt = this.checked;
    });

    d3.select("#chEdge").on("change", function (d) {
        setting.showEdge = this.checked;
    });

    d3.select("#chTrack").on("change", function (d) {
        setting.showTrack = this.checked;
    });

    d3.select("#chTail").on("change", function (d) {
        setting.fadingTail = this.checked;
    });

    d3.select("#fs").attr("href", document.location);

    var imgPreloader = d3.select("#imgPreloader"),
        btnStart = d3.select("#btnStart").on('click', function () {
            vis.resumeShow();
            btnRestart.hide();
            btnStart.hide();
            btnPause.show();
            btnStop.show();
        }),
        btnRestart = d3.select("#btnRestart").on('click', function () {
            vis.stopShow();
            btnRestart.hide();
            btnStart.hide();
            btnPause.show();
            btnStop.show();
            vis.runShow(_data, div, w, h, setting);
        }),
        btnPause = d3.select("#btnPause").on('click', function () {
            vis.pauseShow();
            btnRestart.hide();
            btnPause.hide();
            btnStart.show();
        }),
        btnStop = d3.select("#btnStop").on('click', function () {
            vis.stopShow();
            btnRestart.show();
            btnPause.hide();
            btnStart.hide();
            btnStop.hide();
        }),
        btnReload = d3.select("#btnReload").on('click', function () {
            vis.stopShow();
            btnRestart.hide();
            btnReload.hide();
            btnStart.hide();
            btnPause.hide();
            btnStart.hide();
            imgPreloader.show();
            d3.csv(fy + '.csv', request);
        });

    [
        btnStart, btnRestart,
        btnPause, btnStop,
        btnReload, imgPreloader
    ].forEach(function (d) {
        d.hide = function () {
            d.style("display", "none");
        };
        d.show = function () {
            d.style("display", null);
        };
    });

    btnPause.hide();
    btnStop.hide();

    d3.select("#typeParam")
        .on("change", function (d) {
            cat = this.value;
            btnRestart.show();
        })
        .selectAll('option')
        .data([
            "Major Sector",
            "Procurement Category",
            "Procurement Method",
            "Procurement Type",
            "Product line"
        ])
        .enter()
        .append("option")
        .attr("selected", function (d) { return d == cat ? "selected" : null; })
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });

    var param;
    if (document.location.hash && document.location.hash.indexOf('year') > -1) {
        param = {};
        document.location.hash.replace("#", "")
            .split('&').forEach(function (d) {
                d = d.split('=');
                param[d[0]] = d[1];
            });
        fy = +param.year;
    }

    d3.select("#fiscalYear")
        .on("change", function (d) {
            fy = +this.value;
            /*
        if (document.location.href.indexOf('visualizing.org') > -1)
            document.location = "https://dl-web.dropbox.com/spa/6x4vg7uwuzglgh3/wbgds/public/index.html#year=" + fy;
        */
            btnReload.show();
        })
        .selectAll('option')
        .data([2013])
        .enter()
        .append("option")
        .attr("selected", function (d) { return d == fy ? "selected" : null; })
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });

    imgPreloader.show();

    d3.json("world-countries.json", function (error, collection) {
        feature = feature
            .data(collection.features)
            .enter().append("path")
            .attr("class", "feature");

        /*            .on("mouseover", overpath)
                    .on("mousemove", moverpath)
                //.on("click", clickPath)
                    .on("mouseout", outpath)
        */
        d3.csv(fy + '.csv', request);
    });

})();
