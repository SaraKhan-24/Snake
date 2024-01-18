const gameBoard= document.querySelector("#gameBoard");
const ctx=gameBoard.getContext("2d");
const margin=40;
let count=0;
const windowWidth=window.innerWidth;
const windowHeight=window.innerHeight;
const gameWidth=Math.floor(windowWidth-margin+20);
const gameHeight=Math.floor(windowHeight-margin+20);
gameBoard.width=gameWidth;
gameBoard.height=gameHeight;

const gameOverCanvas = document.querySelector("#gameOverCanvas"); // Create game over canvas


const backgroundAudio=document.getElementById("backgroundAudio");
const eatingAudio=document.getElementById("eatingAudio");
const gameoverAudio=document.getElementById("gameoverAudio");
const starAudio=document.getElementById("starAudio");


const goCtx = gameOverCanvas.getContext("2d");
gameOverCanvas.width=gameWidth/2;
gameOverCanvas.height=gameHeight/2+100;

let particleArray;






const scoreText=document.querySelector("#scoreText");
const resetBtn=document.querySelector("#resetBtn");

const gradient = ctx.createLinearGradient(0, 0, gameWidth, gameHeight); // Adjust as needed
gradient.addColorStop(0, '#4f0090');
gradient.addColorStop(1, '#000000');

const snakeBorder="white";
const foodColour="yellow";
const unitSize=24;
let running=false;
let xVelocity=unitSize;
let yVelocity=0;
let foodX;
let foodY;
let score=0;
let snake=[
    {x:unitSize*4, y:0},
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0, radius: unitSize/2}
];
window.addEventListener("snakemove",
function(event){
    snake[0].x=event.x;
    snake[0].y=event.y;
}
);
function showInstructions(){
    const inst=document.getElementById("Instructions");
    const inCtx=inst.getContext("2d");

};

class Particle{
    constructor(x,y,directionX,directionY,size,color){
        this.x=x;
        this.y=y;
        this.directionX=directionX;
        this.directionY=directionY;
        this.size=size;
        this.color=color;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2,false);
        ctx.fillStyle='#d67ade';
        ctx.fill();
    }
    update(){
        if(this.x>gameBoard.width||this.x<0){
            this.directionX=-this.directionX;
        }
        if(this.y>gameBoard.height||this.y<0){
            this.directionY=-this.directionY;
        }
        let dx = this.x - snake[0].x;
        let dy = this.y - snake[0].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) { // Adjust the distance as needed
          this.directionX += dx / 200; // Repel from snake head
          this.directionY += dy / 200;
        }
        this.x+=this.directionX/7;
        this.y+=this.directionY/7;
        this.draw();
    }
    restore(){
        let dx = this.x - snake[0].x;
        let dy = this.y - snake[0].y;
        this.directionX -= dx/10000; // Repel from snake head
          this.directionY -= dy/10000;
    }
}
function init(){
    particleArray=[];
    let numberofParticles=(gameBoard.height*gameBoard.width)/8000;
    for(let i=0;i<numberofParticles;i++){
        let size=(Math.random()*5)+1;
        let x=(Math.random()*((gameWidth-size*2)-(size*2))+size*2);
        let y=(Math.random()*((gameHeight-size*2)-(size*2))+size*2);
        let directionX=(Math.random()*5)-2.5;
        let directionY=(Math.random()*5)-2.5;
        let color='#d67ade';
    
        particleArray.push(new Particle(x,y,directionX,directionY,size,color) );

    }
}
function connect(){
    for(let a=0;a<particleArray.length;a++){
        for(let b=a;b<particleArray.length;b++){
            let distance=((particleArray[a].x-particleArray[b].x)
            *(particleArray[a].x-particleArray[b].x))
            +((particleArray[a].y-particleArray[b].y)
            *(particleArray[a].y-particleArray[b].y));
            if(distance<(gameWidth/7)*(gameHeight/7)){
                ctx.strokeStyle='#d67ade';
                ctx.lineWidth=1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x,particleArray[a].y);
                ctx.lineTo(particleArray[b].x,particleArray[b].y);
                ctx.stroke();
                
            }
        }
    }
}
function animate(){
    requestAnimationFrame(animate);
    
    ctx.clearRect(0,0,gameWidth,gameHeight);
    

    for(let i=0;i<particleArray.length;i++){
        particleArray[i].update();
    }
    connect();
    drawSnake(); // Draw snake before particles
    drawFood(); 

    if (!running) {
        // Draw game over elements on gameOverCanvas
        goCtx.clearRect(0, 0, gameWidth, gameHeight);
        goCtx.font = "70px MV Boli, sans-serif";
        goCtx.fillStyle = "red";
        goCtx.textAlign = "center";
        goCtx.strokeStyle="white";
        goCtx.fillText("GAME OVER", gameWidth/2-300 , gameHeight / 2 - 150);
        goCtx.font = "30px sans-serif";
        goCtx.fillStyle = "lavender";
        goCtx.fillText("Your Score: " + score, gameWidth / 2-300, gameHeight / 2 -55);
    
       
        resetBtn.style.display="block";
    }
    
}

window.addEventListener("keydown",changeDirection);
resetBtn.addEventListener("click",resetGame);
gameStart();

function gameStart(){
    running=true;
    scoreText.textContent=score;
    init();
    animate();
    createFood();
    drawFood();
    createFood();

    nextTick();
    
};
function nextTick(){
    count++;

    console.log(running);
    if(running){
        setTimeout(()=>{
            backgroundAudio.play();
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            if(count%25==0){
                console.log(count);
                for(let i=0;i<particleArray.length;i++){
                    particleArray[i].restore();
                }
            }
            
            nextTick();
        },75)
    }else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,gameWidth,gameHeight);
};
function createFood(){
    function randomFood(min,max){
        const randNum=Math.round((Math.random()*(max-min)+min)/unitSize)*unitSize;
        return randNum;
    }
    do {
        // Generate random coordinates within valid grid boundaries
        foodX = randomFood(0, gameWidth - unitSize);
        foodY = randomFood(0, gameHeight - unitSize);
    
        // Check for collision with any snake part
      } while (snake.some(part => part.x === foodX && part.y === foodY));

};
function drawFood(){
    ctx.fillStyle = foodColour;
  ctx.beginPath();
  ctx.arc(foodX + unitSize / 2, foodY + unitSize / 2, unitSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
    
    
};
function moveSnake(){
    const head={x:snake[0].x+xVelocity,
                y: snake[0].y+yVelocity};
    snake.unshift(head);
    //if food is eaten
    let dx=snake[0].x-foodX;
    let dy=snake[0].y-foodY;
    let distance=Math.sqrt(dx*dx+dy*dy);

    if((snake[0].x==foodX&&snake[0].y==foodY)||(distance<snake[0].radius+(unitSize/2))){
        eatingAudio.play();

        score++;
        scoreText.textContent=score;
        createFood();
        drawFood();
    }else{
        snake.pop();
    }
};
function drawSnake() {
    const snakeColor=ctx.createLinearGradient(snake[0].x, snake[0].y, snake[snake.length-1].x, snake[snake.length-1].y);
snakeColor.addColorStop(0, '#dbdb00');
snakeColor.addColorStop(1, '#f83e00');

    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
      ctx.beginPath(); // Start a new path for each circle
      ctx.arc(snakePart.x + unitSize / 2, // Center the circle based on unit size
              snakePart.y + unitSize / 2,
              unitSize / 2, // Radius is half the unit size
              0, Math.PI * 2); // Full circle arc
      ctx.fill();
      ctx.closePath(); // Close the path for proper rendering
      ctx.stroke(); // Add border if desired
    });
  }
function changeDirection(event){
    const keyPressed=event.keyCode;
    const LEFT=37;
    const RIGHT=39;
    const UP=38;
    const DOWN=40;
    const goingUp=(yVelocity==-unitSize);
    const goingDown=(yVelocity==unitSize);
    const goingRight=(xVelocity==unitSize);
    const goingLeft=(xVelocity==-unitSize);

    switch(true){
        case(keyPressed==LEFT&&!goingRight):
        xVelocity=-unitSize;
        yVelocity=0;
        break;
        case(keyPressed==UP&&!goingDown):
        yVelocity=-unitSize;
        xVelocity=0;
        break; 
        case(keyPressed==RIGHT&&!goingLeft):
        xVelocity=unitSize;
        yVelocity=0;
        break; 
        case(keyPressed==DOWN&&!goingUp):
        yVelocity=unitSize;
        xVelocity=0;
        break;
    }
};
function checkGameOver(){
    switch(true){
        case(snake[0].x<0):
        running=false;
        displayGameOver();
        break;
        case(snake[0].x>=gameWidth):
        running=false;
        displayGameOver();
                break;
        case(snake[0].y<0):
        running=false;
        displayGameOver();
                break;
        case(snake[0].y>=gameHeight):
        running=false;
        displayGameOver();
                break;
    }
    for(let i=1;i<snake.length;i++){
        if(snake[i].x==snake[0].x&&snake[i].y==snake[0].y){
            running=false;
            displayGameOver();
        }
    }
};
function displayGameOver(){
    gameOverCanvas.style.display = "block";
    backgroundAudio.pause();
    gameoverAudio.play();
};
function resetGame(){
    gameOverCanvas.style.display = "none";
    resetBtn.style.display = "none";
    backgroundAudio.play();
    score=0;
    xVelocity=unitSize;
    yVelocity=0;
    snake=[
        {x:unitSize*4, y:0},
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    for(let i=0;i<particleArray.length;i++){
        particleArray[i].restore();
    }
    gameStart();
};