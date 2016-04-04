  
var populationSize = 10;
var nbIterations = 200;
var defaultTrust = .4;
var transferredValueMultiplier = 2.6;
var transferredValueSplit = .2;

var individual = function(honestyCoeff) {
    this.value = 10.0;
    this.relations = Array.apply(null, Array(populationSize)).map(Number.prototype.valueOf, defaultTrust);
    this.honesty = honestyCoeff;
    this.sumRelations = function() {
        return this.relations.reduce(function(previousValue, currentValue, currentIndex, array) {
            return previousValue + currentValue;
        }, 0);
    }
}

var initializeIndividuals = function(honestyCoeff) {
    var individuals = [];
    for (var i = 0; i < populationSize; ++i) {
        individuals.push(new individual(honestyCoeff));
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
        return {sourceValueIncrease : transferredValue * transferredValueSplit - sourceIndividual.value * (1-transferredValueSplit),
                targetValueIncrease : transferredValue * (1 - transferredValueSplit),
                newTrustValue :  trustValue * (1 + 0.1) / ((1 + trustValue * 0.1)) //S-curve
               };
    } else {
        return {sourceValueIncrease : -sourceIndividual.value * (1-transferredValueSplit),
                targetValueIncrease : transferredValue,
                newTrustValue : trustValue * ((1 + trustValue * 0.1)) / (1 + 0.1) };
    }
} 

var runSimulation = function(honestyCoeff) {
    var individuals = initializeIndividuals(honestyCoeff);
    var individualsArchive = [individuals];
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
        individualsArchive.push(individuals);
    }
    return individualsArchive;
}
