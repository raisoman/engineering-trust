
var canvasHeight = 500;
var canvasWidth = 500;
var padding = 30;
var dataset = [];

var svg = d3.select("body").append("svg")
                .attr("width", canvasWidth)
                .attr("height", canvasHeight);

var xScale = d3.scale.linear()  // xScale is width of graphic
                .domain([0, d3.max(dataset, function(d) {
                    return 500/*d.totalValue*/;  // input domain
                })])
                .range([padding, canvasWidth - padding * 2]); // output range

var yScale = d3.scale.linear()  // yScale is height of graphic
                .domain([0, d3.max(dataset, function(d) {
                    return 100/* d.honestyCoeff*/;  // input domain
                })])
                .range([canvasHeight - padding, padding]);  // remember y starts on top going down so we flip

var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(5);

var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (canvasHeight - padding) +")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding +",0)")
    .call(yAxis);

var interval = setInterval(function() {
    var honestyCoeff = Math.random();
    var result = runSimulation(honestyCoeff);
    var totalValue = result.reduce(function(previousValue, currentValue, currentIndex, array) {
                                        return previousValue + currentValue.value;
                                   }, 0);
    var d = { honestyCoeff : honestyCoeff * 100,
              totalValue: Math.log10(totalValue) * 50
            };
    dataset.push(d);
    if (dataset.length > 500) {
        dataset.shift();
    }

    xScale.domain([0, d3.max(dataset, function(d) {
        return d.honestyCoeff; })]);
    yScale.domain([0, d3.max(dataset, function(d) {
        return d.totalValue; })]);

    svg.select(".x.axis")
        .call(xAxis);

    svg.select(".y.axis")
        .call(yAxis);

    var circle = svg.selectAll("circle").data(dataset, function key(d) {return d.honestyCoeff;});

    circle.enter()
        .append("circle")
        .attr("cx", function(d) {  // Circle's Y
            return xScale(d.honestyCoeff);
        })
        .attr("cy", function(d) {  // Circle's Y
            return yScale(d.totalValue);
        })
    .transition()  // Transition from old to new
    .duration(1000)  // Length of animation
    .each("start", function() {  // Start animation
        d3.select(this)  // 'this' means the current element
            .attr("fill", "red")  // Change color
            .attr("r", 2);  // Change radius
    })
    .each("end", function() {  // End animation
        d3.select(this)  // 'this' means the current element
            .transition()
            .duration(500)
            .attr("fill", "red")  // Change color
            .attr("opacity", 0.2)
            .attr("r", 5);  // Change size
    });

    circle.exit().remove();
}, 20);
