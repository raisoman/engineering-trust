
var canvasHeight = 500;
var canvasWidth = 500;
var padding = 30;
var dataset = [];

var valueVsHonestyGraph = new liveGraph("body", dataset);

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
    valueVsHonestyGraph.update(dataset);

}, 20);
