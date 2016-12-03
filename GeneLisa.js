/**
 # Copyright (C) 2016 Prabod Rathnayaka <prabod@rathnayaka.me>
 #
 # This file is part of GeneLisa.
 #
 # GeneLisa is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # Copyright Header is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with Copyright Header.  If not, see <http://www.gnu.org/licenses/>.
 #
 */


/**
 * Population for a Generation
 * */
var POPULATION = 50;

/**
 * Number of Vertices for a Polygon
 * */
var VERTICES = 4;

/**
 * Size of a Gene
 * */
var GENE_SIZE = 4 + (2 * VERTICES);

/**
 * Number of Polygons
 * */
var POLYGONS = 125;

/**
 * Length of a Chromosome
 * */
var CHROME_SIZE = GENE_SIZE * POLYGONS;

/**
 * Percentage selected for crossover for next generation
 * */
var CROSSOVER_RATE = 0.15;

/**
 * Percentage that a Chromosome can be mutated
 * */
var MUTATION_RATE = 0.01;

/**
 * Percentage that a Chromosome selected for mutation will be mutated
 * */
var MUTATE_AMOUNT = 0.1;


var population = [];
var generation = 0; // Generation of the population
var goal;
var workingData = [];


/**
 * Uses ECMASCRIPT6*/

/**
 * Class that represent a Chromosome
 * */
class Chromosome{

    constructor(bitString,geneSize,chromoSize){

        this.valueString = bitString;
        this.geneSize = geneSize;
        this.chromoSize = chromoSize;
        this.c=document.getElementById("workingCanvas");
        this.ctx=this.c.getContext("2d");
        this.vertices = VERTICES;
        this.fitnessValue = 0;

    }

    /**
     * Generate random DNA for the Initial Generation
     * Value Encoding is used for DNA encoding
     * DNA = [RED, GREEN, BLUE, ALPHA, X1, Y1, X2, Y2, ...]
     * */
    randomGenes(){

        var bString = [];
        for (var i = 0; i < this.chromoSize; i+= this.geneSize){
            /**
             * Generate RGBA
             * */
            bString.push(
                Math.random(), // R
                Math.random(), // G
                Math.random(), // B
                Math.max(Math.random() * Math.random(), 0.2) //A
            );

            /**
             * Generate random (x,y) for vertices
             * */
            var X = Math.random();
            var Y = Math.random();

            for (var j = 0; j < this.vertices ; j++){

                bString.push(
                    X + Math.random() - 0.5,
                    Y + Math.random() - 0.5
                );
            }
        }
        this.valueString = bString;
    }

    /**
     * Draw the Chromosome in the canvas
     * */
    draw(context,width,height){
        /**
         * Paint the canvas black to make sure nothing left from the previous draw
         * */
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        /**
         * Draw the Starting Point -> lines to vertices
         * */
        for(var i = 0; i < this.chromoSize ; i += this.geneSize){

            context.beginPath();

            context.moveTo(
                this.valueString[i + 4] * width,
                this.valueString[i + 5] * height
            );

            for(var j = 0; j < this.vertices - 1; j++){
                /**
                 * Draw Lines*/
                context.lineTo(
                    this.valueString[i + j * 2 + 6] * width,
                    this.valueString[i + j * 2 + 7] * height
                );
            }

            context.closePath();

            context.fillStyle = 'rgba(' +
                ((this.valueString[i    ] * 255) >> 0) + ',' + // R - int [0,255]
                ((this.valueString[i + 1] * 255) >> 0) + ',' + // G - int [0,255]
                ((this.valueString[i + 2] * 255) >> 0) + ',' + // B - int [0,255]
                  this.valueString[i + 3] + ')';
            //Fill the polygon
            context.fill();
        }
    }

    /**
     * Fitness Function
     * fitness = 1 -    (Square of pixel difference between chromosome and reference Image)
     *                  ____________________________________________________________________
     *                  ( Resolution of the Image * count(RGBA) * Number of Possible Values)
     *
     * This fitness function stays inside [0,1]
     * */
    fitness(width,height){

        //Draw the Chromosome First
        this.draw(this.ctx,width,height);

        var fit = 0;

        var imagedata = this.ctx.getImageData(0,0,width,height).data;

        for (var i = 0; i < workingData.length;i++){

            var dist = workingData[i] - imagedata[i];

            fit += dist * dist;
        }

        this.fitnessValue = 1 - fit / (75 * 75 * 4 * 256 * 256);

        return this.fitnessValue;
    }
}

/**
 * Cross two Chromosomes and produce a child Chromosome
 * */
function crossover(chromosome1,chromosome2,rate,geneSize,chromoSize) {

    var rand = Math.random(); // Random value for check crossover chance

    if (rand < rate){

        var vString = [];

        for (var i =0; i< chromoSize; i += geneSize){

            for(var j = 0; j < geneSize; j++){
                /**
                 * Evenly Choose a Parent for breeding*/
                var inheritedGene = (Math.random() < 0.5) ? chromosome1 : chromosome2;

                var dna = inheritedGene.valueString[i+j];

                var randnum = Math.random(); // Random Number for Mutation chance

                if (randnum < MUTATION_RATE){
                    /**
                     * Mutate by some Amount*/
                    dna += Math.random() * MUTATE_AMOUNT * 2 - MUTATE_AMOUNT;
                }

                if (dna < 0)
                    dna = 0;

                if (dna > 1)
                    dna = 1;

                vString.push(dna);
            }
        }
        return new Chromosome(vString,geneSize,chromoSize);
    }
    /**
     * If No chance for crossover. Return one of the parent Chromosome*/
    return (Math.random() < 0.5) ? chromosome1 : chromosome2;

}

/**
 * Roulette Wheel Function to select two parent for breeding
 * NEVER USED
 * a GREEDY METHOD used for selection*/
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

/**
 * Initiate GeneLisa.js
 * */
function init() {
        /**
         * Get Reference Canvas and Context*/
        var goalCanvas=document.getElementById("goal");
        var goalctx=goalCanvas.getContext("2d");
        var base_image = new Image();

        /**
         * Draw Reference image on canvas*/
        base_image.onload = function(){
            goalctx.drawImage(base_image,0,0);
            goalCanvas.width = 75;
            goalCanvas.height = 75;

            goalctx.drawImage(base_image,
                0, 0, 350, 350, 0, 0,
                75, 75);

            var imageData = goalctx.getImageData(0, 0,
                75 ,
                75).data;

            workingData = [];
            var p = 75 * 75 * 4;

            for (var i = 0; i < p; i++) {
                workingData[i] = imageData[i];
            }

            goalCanvas.width = 350;
            goalCanvas.height = 350;
            goalctx.drawImage(base_image, 0, 0);

        };
        base_image.src = './mona.gif';

        /**
         * Generate Random Chromosomes for the initial generation
         * */
        for(var i = 0 ; i < POPULATION; i++){
            var cr = new Chromosome([],GENE_SIZE,CHROME_SIZE);
            cr.randomGenes();
            population.push(cr);
        }

}

/**
 * Breed a New Generation of Chromosomes
 * */
function breed() {

    var totalFitness = 0;
    var fittest;
    var fit=0;

    /**
     * Calculate fitness of each and every chromosome
     * */
    for(var j = 0 ; j < population.length ; j++){

        var temp = population[j].fitness(75,75,goal);

        if (temp >= fit){

            fit = temp;
            fittest = population[j];// Fittest Chromosome in a Generation

        }

        totalFitness += temp;
    }

    /**
     * Sort the Generation
     * */
    population = population.sort(function(a, b) {
        return b.fitnessValue - a.fitnessValue;
    });

    var newPopulation = [];

    /**
     * Select the Chromosomes with best fitnesses
     * */
    var selectCount = Math.floor(population.length * CROSSOVER_RATE);

    /**
     * Number of Chromosomes that needed to be crossed with the each of the Chosen Chromosome
     * */
    var randCount = Math.ceil(1 / CROSSOVER_RATE);

    /**
     * Select two parents and breed
     * */
    for (var i = 0; i < selectCount; i++) {

        for (var h = 0; h < randCount; h++) {

            var parent = i;

            while (parent == i) {

                parent = (Math.random() * selectCount) >> 0;

            }
            /**
             * Breed
             * */
            var crossed = crossover(population[i], population[parent], CROSSOVER_RATE, GENE_SIZE, CHROME_SIZE);
            newPopulation.push(crossed);
        }
    }

    /**
     * Draw the fittest Chromosome to Output Canvas
     * */
    var myCanvas = document.getElementById("myCanvas");
    var ct = myCanvas.getContext("2d");
    fittest.draw(ct,350,350);
    population = newPopulation;
    generation ++;

    /**
     * update generation and fitness
     * */
    document.getElementById("gen").innerHTML = generation;
    document.getElementById("fit").innerHTML = "Fitness = " + fit * 100 + "%";
}