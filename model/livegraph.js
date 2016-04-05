"use strict";

function liveGraph(targetDiv, data) {

    var canvasHeight = 500;
    var canvasWidth = 500;
    var padding = 40;

    this.svg = d3.select(targetDiv).append("svg")
                .attr("width", canvasWidth)
                .attr("height", canvasHeight);

    var xScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                        return 500;
                    })])
                    .range([padding, canvasWidth - padding * 2]);

    var yScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                        return 100;
                    })])
                    .range([canvasHeight - padding, padding]);

    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickValues(d3.range(0, 100, 25));;

    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (canvasHeight - padding) +")")
        .call(xAxis);

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding +",0)")
        .call(yAxis);

    /*
     * Member function to update the graph when new data ticks in
     */
    this.update = function(data, xVar, yVar) {

        xScale.domain([0, d3.max(data, function(d) {
            return d[xVar]; })]);
        yScale.domain([d3.min(data, function(d) {
            return d[yVar]; }),
                      d3.max(data, function(d) {
            return d[yVar]; })]);

        this.svg.select(".x.axis")
            .call(xAxis);

        this.svg.select(".y.axis")
            .call(yAxis);

        var circle = this.svg.selectAll("circle").data(data, function key(d) {return d[xVar];});

        circle.attr("cx", function(d) {
                return xScale(d[xVar]);
            })
            .attr("cy", function(d) {
                return yScale(d[yVar]);
            })

        circle.enter()
            .append("circle")
            .attr("cx", function(d) {
                return xScale(d[xVar]);
            })
            .attr("cy", function(d) {
                return yScale(d[yVar]);
            })
        .transition()
        .duration(1000)
        .each("start", function() {
            d3.select(this)
                .attr("class", "datadotsmall")
                .attr("r", 2);
        })
        .each("end", function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("class", "datadotlarge")
                .attr("r", 5);
        });

        circle.exit().remove();
    }
}