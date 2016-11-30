/**
 * Created by prabod on 11/30/16.
 */
var POPULATION = 10;
var VERTICES = 4;
var GENE_SIZE = 4 + (2 * VERTICES);
var POLYGONS = 20;
var CHROME_SIZE = GENE_SIZE * POLYGONS;
var CROSSOVER_RATE = 0.6;
var MUTATION_RATE = 0.001;
var population = [];
var generation = 0;
var goal;
class Chromosome{
    constructor(bitString,geneSize,chromoSize){
        this.bitString = bitString;
        this.geneSize = geneSize;
        this.chromoSize = chromoSize;
        this.c=document.getElementById("workingCanvas");
        this.ctx=this.c.getContext("2d");
        this.vertices = VERTICES;
        this.fitnessValue = 0;
    }

    randomGenes(){
        var bString = [];
        for (var i = 0; i < this.chromoSize; i+= this.geneSize){
            bString.push(
                Math.random(), // R
                Math.random(), // G
                Math.random(), // B
                Math.max(Math.random() * Math.random(), 0.2) //A
            );


            var X = Math.random();
            var Y = Math.random();
            for (var j = 0; j < this.vertices ; j++){
                bString.push(
                    X + Math.random() - 0.5,
                    Y + Math.random() - 0.5
                )
            }
        }
        this.bitString = bString;
    }
    mutate(rate){
        for (var i = 0 ; i < this.bitString.length ;i++){
            var rand = Math.random();
            if (rand < rate){
                this.bitString[i] = Math.random()
            }

        }
    }

    draw(context,width,height){
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);
        for(var i = 0; i < this.chromoSize ; i += this.geneSize){
            context.beginPath();
            context.moveTo(
                this.bitString[i+4] * width,
                this.bitString[i+5] * height
            );
            for(var j = 0; j < this.vertices - 1; j++){
                context.lineTo(this.bitString[i+4+(2*(j+1))] * width,
                    this.bitString[i+5+(2*(j+1))] * height)
            }
            context.closePath();
            var colors = 'rgba(' +
                ((this.bitString[i] * 255) >> 0) + ',' + // R - int [0,255]
                ((this.bitString[i + 1] * 255) >> 0) + ',' + // G - int [0,255]
                ((this.bitString[i + 2] * 255) >> 0) + ',' + // B - int [0,255]
                this.bitString[i + 3] + ')'; // A - float [0,1]
            context.fillStyle = colors;
            context.fill();
        }
    }
    fitness(width,height,goal){
        this.draw(this.ctx,width,height);
        var fit = 0;
        var imagedata = this.ctx.getImageData(0,0,width,height).data;

        for (var i = 0; i < goal.length;i++){
            var dist = goal[i] - imagedata[i];
            fit += dist * dist;
        }
        this.fitnessValue = fit*100/(goal.length*256*256);
        //this.ctx.clearRect(0, 0, 350, 350);
        return this.fitnessValue;
    }
}

function crossover(chromesome1,chromosome2,rate,geneSize,chromoSize) {
    var rand = Math.random();
    if (rand < rate){
        var index = rand * chromesome1.bitString.length >> 0;
        var bt = [];
        for (var i =0; i< chromoSize; i += geneSize){
            for(var j = 0; j < geneSize; j++){
                var inheritedGene = (Math.random() < 0.5) ? chromesome1 : chromosome2;
                var dna = inheritedGene.bitString[i+j];
                bt.push(dna);
            }
        }
        var bt1 = chromesome1.bitString.slice(0,index).concat(chromosome2.bitString.slice(index));
        var bt2 = chromosome2.bitString.slice(0,index).concat(chromesome1.bitString.slice(index));
        var cr1 =  new Chromosome(bt1,geneSize,chromoSize);
        var cr2 =  new Chromosome(bt2,geneSize,chromoSize);
        return [cr1,cr2];
    }
    return [chromesome1 ,chromosome2];

}
function roulette(totalFitness, population) {
    var slice = Math.random() * totalFitness;
    var fitnessSoFar = 0;
    for(var i = 0 ; i < POPULATION; i++){
        fitnessSoFar += population[i].fitnessValue;
        if (fitnessSoFar >= slice){
            return population[i];
        }
    }
    return population[0];
}
function init() {
        var goalc=document.getElementById("goal");
        var goalctx=goalc.getContext("2d");
        var base_image = new Image();

        base_image.onload = function(){
            goalctx.drawImage(base_image,0,0);
            goal = goalctx.getImageData(0,0,350,350).data;
            console.log(goal);

        };
        base_image.src = './mona.png';
        for(var i = 0 ; i < POPULATION; i++){
            var cr = new Chromosome([],GENE_SIZE,CHROME_SIZE);
            cr.randomGenes();
            population.push(cr);
        }

}

function tick() {
    var totalFitness = 0;
    var fittest;
    var fit=0;
    for(var j = 0 ;j < population.length ; j++){
        var temp = population[j].fitness(350,350,goal);
        if (temp >= fit){
            fit = temp;
            fittest = population[j];
        }
        totalFitness += temp;
    }
    population = population.sort(function(a, b) {
        return b.fitnessValue - a.fitnessValue;
    });
    var newPopulation = [];
    for(var k = 0 ; k < POPULATION/2; k++){
        var father = roulette(totalFitness,population);
        var mother = roulette(totalFitness,population);
        var crossed = crossover(father,mother,CROSSOVER_RATE,GENE_SIZE,CHROME_SIZE);
        crossed[0].mutate(MUTATION_RATE);
        crossed[1].mutate(MUTATION_RATE);
        newPopulation.push(crossed[0],crossed[1]);
    }
    var my =document.getElementById("myCanvas");
    var ct =my.getContext("2d");
    fittest.draw(ct,350,350);
    population = newPopulation;
    generation ++;
    console.log(fit);
    document.getElementById("gen").innerHTML = generation;
}