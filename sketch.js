var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;
var money = 0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mariorunningImg = loadAnimation("Capture1.png","Capture3.png","Capture4.png")
   mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("backg.jpg");
  
  obstacle1Img = loadImage ("obstacle1.png")
  obstacle2Img = loadImage ("obstacle2.png")
obstacle3Img = loadImage ("obstacle3.png")
  
  coinImg = loadImage("coin.png")

gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup()
{
  createCanvas(windowWidth,windowHeight)
  ground = createSprite(900,width-90,1500,20)
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  coin1 = createSprite(35,34,20,20)
  coin1.addImage("c",coinImg)
  coin1 .scale = 0.1;
  
  mario = createSprite(height -500,150,30,30)  
  mario.addAnimation("m",mariorunningImg)
  mario.scale = 0.5;
  
   coinGroup = new Group();
  obstaclesGroup = new Group();
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  
  score = 0;
}





function draw(){
  background ("blue")
  
   textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
  text("money earn :" + money,50,40)
 if (gameState===PLAY){
   score = score + Math.round(getFrameRate()/60);
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
   if (touches.length > 0 ||  keyDown("space")&&mario .y>=135){
    mario.velocityY = -12
    touches = []
  }
  if (mario.isTouching(coinGroup)){
    coinGroup.destroyEach()
    money = money +3
    
  }
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(ground);
    
    createCoin();
     createObstacle();
  
   if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    } 
  }
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

  
  drawSprites() 
}

function createObstacle(){
  if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height -70,10,40);
   obstacle.velocityX = -(6 + score/100);
    
    obstacle.setCollider("rectangle",0,0,300,obstacle.height)
   obstacle.debug = true
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1Img);
              break;
      case 2: obstacle.addImage(obstacle2Img);
              break;
      case 3: obstacle.addImage(obstacle3Img);
              break;
     
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2 ;
    obstacle.lifetime = 300;
    
    obstacle.collide(ground);
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function createCoin()
{
   if (frameCount % 60 === 0) {
    var coin = createSprite(600, 20,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImg);
    coin.scale = 0.3;
    coin.velocityX = -(3  + score/100);
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = mario.depth;
     mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin );
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  mario.changeAnimation("m",mariorunningImg)
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  money = 0;    
}