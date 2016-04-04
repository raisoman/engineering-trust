
var dataset = [];

var valueVsHonestyGraph = new liveGraph("#valueVsHonestyGraph", dataset);
var trustVsHonestyGraph = new liveGraph("#trustVsHonestyGraph", dataset);
var circularGraphs = [];
for (i = 0; i < 2; ++i) {
    circularGraphs[i] = [];
    for (j = 0; j < 2; j++) {
        var divName = "circularGraph" + i + "_" + j;
        var div = d3.select("body").append("div");
        div.attr("id", divName);
        circularGraphs[i][j] = new circularGraph("#" + divName, {diameter: 200});
    }
}

var interval = setInterval(function() {
    var honestyCoeff = Math.random();
    var fullResult = runSimulation(honestyCoeff);
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
    var i,j;
    if (honestyCoeff < .25) {
        i = 0; j = 0;
    } else if (honestyCoeff >= .25 && honestyCoeff < .5) {
        i = 0; j = 1;
    } else if (honestyCoeff >= .5 && honestyCoeff < .75) {
        i = 1; j = 0;
    } else if (honestyCoeff >= .75 && honestyCoeff < 1) {
        i = 1; j = 1;
    }
    circularGraphs[i][j].update(circularGraphData);

}, 100);
