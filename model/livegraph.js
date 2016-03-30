function liveGraph(targetDiv, data) {

    this.svg = d3.select(targetDiv).append("svg")
                .attr("width", canvasWidth)
                .attr("height", canvasHeight);

    var xScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                        return 500/*d.totalValue*/;
                    })])
                    .range([padding, canvasWidth - padding * 2]);

    var yScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                        return 100/* d.honestyCoeff*/;
                    })])
                    .range([canvasHeight - padding, padding]);

    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5);

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
    this.update = function(data) {

        xScale.domain([0, d3.max(data, function(d) {
            return d.honestyCoeff; })]);
        yScale.domain([0, d3.max(data, function(d) {
            return d.totalValue; })]);

        this.svg.select(".x.axis")
            .call(xAxis);

        this.svg.select(".y.axis")
            .call(yAxis);

        var circle = this.svg.selectAll("circle").data(data, function key(d) {return d.honestyCoeff;});

        circle.enter()
            .append("circle")
            .attr("cx", function(d) {
                return xScale(d.honestyCoeff);
            })
            .attr("cy", function(d) {
                return yScale(d.totalValue);
            })
        .transition()
        .duration(1000)
        .each("start", function() {
            d3.select(this)
                .attr("fill", "red")
                .attr("r", 2);
        })
        .each("end", function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "red")
                .attr("opacity", 0.2)
                .attr("r", 5);
        });

        circle.exit().remove();
    }
}