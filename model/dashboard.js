
var dataset = [];

var valueVsHonestyGraph = new liveGraph("#valueVsHonestyGraph", dataset);
var trustVsHonestyGraph = new liveGraph("#trustVsHonestyGraph", dataset);
var circularTrustGraph = new circularGraph("#circularGraph");


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
    circularTrustGraph.update(circularGraphData);

}, 200);
//console.log(result);
