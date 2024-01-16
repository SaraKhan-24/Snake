const gameBoard= document.querySelector("#gameBoard");
const ctx=gameBoard.getContext("2d");
const scoreText=document.querySelector("#scoreText");
const resetBtn=document.querySelector("#resetBtn");
const margin=40;
const windowWidth=window.innerWidth;
const windowHeight=window.innerHeight;
const gameWidth=Math.floor(windowWidth-margin+20);
const gameHeight=Math.floor(windowHeight-margin+20);
gameBoard.width=gameWidth;
gameBoard.height=gameHeight;
const boardBackground="black";
const snakeColor="lightgreen";
const snakeBorder="lightgreen";
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
    {x:0, y:0}
];
window.addEventListener("keydown",changeDirection);
resetBtn.addEventListener("click",resetGame);
gameStart();

function gameStart(){
    running=true;
    scoreText.textContent=score;
    createFood();
    drawFood();
    createFood();
    nextTick();
};
function nextTick(){

    console.log(running);
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        },75)
    }else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle=boardBackground;
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
   

    if((snake[0].x==foodX&&snake[0].y==foodY)){
        score++;
        scoreText.textContent=score;
        createFood();
        drawFood();
    }else{
        snake.pop();
    }
};
function drawSnake() {
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
        break;
        case(snake[0].x>=gameWidth):
        running=false;
        break;
        case(snake[0].y<0):
        running=false;
        break;
        case(snake[0].y>=gameHeight):
        running=false;
        break;
    }
    for(let i=1;i<snake.length;i++){
        if(snake[i].x==snake[0].x&&snake[i].y==snake[0].y){
            running=false;
        }
    }
};
function displayGameOver(){
    ctx.font="50px MV Boli";
    ctx.textAlign="center";
    ctx.fillText("GAME OVER",gameWidth/2,gameHeight/2);
    running=false;
};
function resetGame(){
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
    gameStart();
};