  
var populationSize = 10;
var nbIterations = 100;
var defaultTrust = .4;
var transferredValueMultiplier = 2.6;
var transferredValueSplit = .2;

var initializeIndividuals = function() {
    var individuals = [];
    for (var i = 0; i < populationSize; ++i) {
        individual = {
            value: 10.0,
            relations : Array.apply(null, Array(populationSize)).map(Number.prototype.valueOf, defaultTrust),
            honesty: 0.99
        };
        individuals.push(individual);
    }
    return individuals;
}

var computeRelation = function(sourceIndex, targetIndex, individuals) {
    var sourceIndividual = individuals[sourceIndex];
    var targetIndividual = individuals[targetIndex];
    var trustValue = sourceIndividual.relations[targetIndex]; // should be the same as
                                                              // targetIndividual.relations[sourceIndex]
    var transferredValue = sourceIndividual.relations[targetIndex] * sourceIndividual.value * transferredValueMultiplier;
    var honestyTest = targetIndividual.honesty >= Math.random();
    if (honestyTest) {
        return {sourceValueIncrease : transferredValue * transferredValueSplit,
                targetValueIncrease : transferredValue * (1 - transferredValueSplit),
                newTrustValue :  trustValue * (1 + 0.1) / ((1 + trustValue * 0.1)) //S-curve
               };
    } else {
        return {sourceValueIncrease : sourceIndividual.value * (1-transferredValueSplit),
                targetValueIncrease : transferredValue,
                newTrustValue : 0.1 }; //trust discontinued
    }
} 

var runSimulation = function() {
    var individuals = initializeIndividuals();
    for (var i = 0; i < nbIterations; ++i) {
        var relationSourceIndex = Math.floor(Math.random()*populationSize);
        var relationTargetIndex = Math.floor(Math.random()*populationSize);
        if (relationSourceIndex === relationTargetIndex) {
            continue;
        }
        var newRelations = computeRelation(relationSourceIndex, relationTargetIndex, individuals);
        individuals[relationSourceIndex].value += newRelations.sourceValueIncrease;
        individuals[relationSourceIndex].relations[relationTargetIndex] = newRelations.newTrustValue;
        individuals[relationTargetIndex].value += newRelations.targetValueIncrease;
        individuals[relationTargetIndex].relations[relationSourceIndex] = newRelations.newTrustValue;
    }
    return individuals;
}

var result = runSimulation();
console.log(result);
//var totalValue = result.reduce((prev, curr) => prev + curr.value) ;
var totalValue = result.reduce(function(previousValue, currentValue, currentIndex, array) {
    return previousValue + currentValue.value;
}, 0);
console.log(totalValue);
