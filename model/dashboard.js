"use strict";

var dataset = [];
var valueVsHonestyGraph = new liveGraph("#valueVsHonestyGraph", dataset);
var trustVsHonestyGraph = new liveGraph("#trustVsHonestyGraph", dataset);
var circularGraphs = [];
for (var i = 0; i < 4; ++i) {
    var divName = "circularGraph" + i;
    var div = d3.select("body").append("div");
    div.attr("id", divName)
       .attr("class", "smallgraph");
    circularGraphs[i] = new circularGraph("#" + divName, {diameter: 200});
}

var populationSize = 10;
// when the input range changes update the population size
d3.select("#populationSize").on("input", function() {
  populationSize = +this.value;
  d3.select("#populationSize-value").text(populationSize);
});

var interval = setInterval(function() {
    var honestyCoeff = Math.random();
    var fullResult = runSimulation(honestyCoeff, populationSize);
    var result = fullResult[fullResult.length -1];
    var totalValue = result.reduce(function(previousValue, currentValue, currentIndex, array) {
                                        return previousValue + currentValue.value;
                                   }, 0);
    var totalTrust = result.reduce(function(previousValue, currentValue, currentIndex, array) {
                                        return previousValue + currentValue.sumRelations();
                                   }, 0);
    var d = { honestyCoeff : honestyCoeff * 100,
              totalValue: Math.log10(totalValue) * 50,
              totalTrust : totalTrust
            };
    dataset.push(d);
    if (dataset.length > 300) {
        dataset.shift();
    }
    valueVsHonestyGraph.update(dataset, 'honestyCoeff', 'totalValue');
    trustVsHonestyGraph.update(dataset, 'honestyCoeff', 'totalTrust');

    var relationList = result.reduce(function(previousValue, currentValue, currentIndex) {
        return previousValue.concat(currentValue.relations.map(function(d, i) {
            return {source: currentIndex,
                    target: i,
                    value: d
                };
        }));
    }, []);
    var circularGraphData = { nodes : result,
                             links : relationList };
    circularGraphs[Math.floor(honestyCoeff * 4)].update(circularGraphData);

}, 100);


function changeCSS(cssFile, cssLinkIndex) {
    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
    oldlink.href = cssFile;
}