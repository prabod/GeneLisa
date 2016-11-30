/**
 * Created by prabod on 11/30/16.
 */
class Chromosome{
    constructor(bitString,geneSize,chromoSize){
        this.bitString = bitString;
        this.geneSize = geneSize;
        this.chromoSize = chromoSize;
        this.c=document.getElementById("myCanvas");
        this.ctx=this.c.getContext("2d");
        this.vertices = (this.geneSize - 4) / 2;
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

    draw(width,height){

        for(var i = 0; i < this.chromoSize ; i += this.geneSize){
            this.ctx.beginPath();
            this.ctx.moveTo(
                this.bitString[i+4] * width,
                this.bitString[i+5] * height
            );
            for(var j = 0; j < this.vertices - 1; j++){
                this.ctx.lineTo(this.bitString[i+4+(2*(j+1))] * width,
                    this.bitString[i+5+(2*(j+1))] * height)
            }
            this.ctx.closePath();
            var colors = 'rgba(' +
                ((this.bitString[i] * 255) >> 0) + ',' + // R - int [0,255]
                ((this.bitString[i + 1] * 255) >> 0) + ',' + // G - int [0,255]
                ((this.bitString[i + 2] * 255) >> 0) + ',' + // B - int [0,255]
                this.bitString[i + 3] + ')'; // A - float [0,1]
            this.ctx.fillStyle = colors;
            this.ctx.fill();
        }
    }
    fitness(width,height,goal){

    }
}

function crossover(chromesome1,chromosome2,rate,geneSize,chromoSize) {
    var rand = Math.random();
    if (rand < rate){
        var index = rand * chromesome1.bitString.length >> 0;
        var bt1 = chromesome1.bitString.slice(0,index) + chromesome2.bitString.slice(index);
        var bt2 = chromesome2.bitString.slice(0,index) + chromesome1.bitString.slice(index);
    }
    return [new Chromosome(bt1,geneSize,chromoSize), new Chromosome(bt2,geneSize,chromoSize)];
}