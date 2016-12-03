# GeneLisa

According to MathWorks.com **Genetic Algorithm** is defined as


>A genetic algorithm (GA) is a method for solving both constrained and unconstrained optimization problems based on a natural selection process that mimics biological evolution. The algorithm repeatedly modifies a population of individual solutions. At each step, the genetic algorithm randomly selects individuals from the current population and uses them as parents to produce the children for the next generation. Over successive generations, the population "evolves" toward an optimal solution.

When I'm surfing through the Internet,I came across [Roger Johansson's blog](https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/). He did this amazing thing with genetic algorithms. He recreated a masterpiece drawing from using just 50 polygons. You can read about it by going to the link provided.

I wanted to play around with Genetic Algorithms from a long time. I decided to do a Javascript Implementation of this concept.I was able to do it to some extent.I will guide you through the code.

[See a Demo](https://prabod.github.io/GeneLisa/)

####Pseudocode of GA

1. [Start] Generate random population of n chromosomes (suitable solutions for the problem)
2. [Fitness] Evaluate the fitness f(x) of each chromosome x in the population
3. [New population] Create a new population by repeating following steps until the new population is complete
   1. [Selection] Select two parent chromosomes from a population according to their fitness (the better fitness, the bigger chance to be selected)
   2. [Crossover] With a crossover probability crossover the parents to form a new offspring (children). If no crossover was performed, offspring is an exact copy of parents.
  3. [Mutation] With a mutation probability mutate new offspring at each locus (position in chromosome).
  4. [Accepting] Place new offspring in a new population
4. [Replace] Use new generated population for a further run of algorithm
5. [Test] If the end condition is satisfied, stop, and return the best solution in current population
6. [Loop] Go to step 2

#### Encoding of Chromosome

There are 4 ways to encode a chromosome

1. Binary Encoding
2. Permutation Encoding
3. Value Encoding
4. Tree Encoding

I have used value encoding to encode this chromosome.

>CHROMOSOME = [RED, GREEN, BLUE, ALPHA , X1, Y1, X2, Y2, ...]

With this Chromosome we generate a random population for the initial Generation

<script src="https://gist.github.com/prabod/51f35979d7dbc7f8da7809db050e3baa.js"></script>


#### Fitness Function

Fitness Function is the most important part of a Genetic Algorithm. Success of your whole algorithm is based on this function.
For this specific occasion I have defined my fitness function  
as follows

>FITNESS = 1 - (Square of pixel difference between chromosome and reference Image)/( Resolution of the Image * count(RGBA) * Number of Possible Values)

<script src="https://gist.github.com/prabod/73e3a8b0c1dbbadfc9d2b9edb34c3670.js"></script>



#### Breed New Generation


##### Selection

I have used a greedy approach to fasten up the process. Usually selection is done through Roulette Wheel selection.

Here I select a percentage with the best fitness then breed them with randomly selected chromosomes from the population.

<script src="https://gist.github.com/prabod/2f0c4219209a35366dee1970ceac6e66.js"></script>

##### Crossover

When two chromosomes passed to the crossover function, it evenly choose one parent to inherit from. Then if mutation is possible, mutate and creates the new Child.

<script src="https://gist.github.com/prabod/2a4c8486a4b1c9514b2bc35a2633933d.js"></script>


Likewise when the whole process generated the same amount that a population have, that new population replaces the old population and continue till the condition satisfies

#####Some of the results from my simulation


<img src="/content/images/2016/12/download--6--2.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--7--2.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--8--1.png" alt="Drawing" style="width: 100px;"/>
<img src="/content/images/2016/12/download--9-.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--10--2.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--11-.png" alt="Drawing" style="width: 100px;"/>
<img src="/content/images/2016/12/download--12-.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--13--1.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--14-.png" alt="Drawing" style="width: 100px;"/>
<img src="/content/images/2016/12/download--15--1.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--16-.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--1-.png" alt="Drawing" style="width: 100px;"/>
<img src="/content/images/2016/12/download--2-.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--3-.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--4-.png" alt="Drawing" style="width: 100px;"/>
<img src="/content/images/2016/12/download--5-.png" alt="Drawing" style="width: 100px;"/><img src="/content/images/2016/12/download--5-.png" alt="Drawing" style="width: 100px;"/>
Reference Image
<img src="/content/images/2016/12/download.png" alt="Drawing" style="width: 100px;"/>

[Full Source Code GitHub](https://github.com/prabod/GeneLisa)

[See a Demo](https://prabod.github.io/GeneLisa/)
