var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  jumpSound=loadSound("jump.mp3")
  checkPointSound=loadSound("checkPoint.mp3")
  dieSound=loadSound("die.mp3")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
 
}

function setup() {
  createCanvas(600, 500);
  
  trex = createSprite(50,380,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,380,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,390,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4+score/30);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 362) {
        trex.velocityY = -12;
      jumpSound.play();
    }
    if(score>0&&score%100===0){
      checkPointSound.play();
      
    }
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    //  trex.velocityY=-12
    //  jumpSound.play();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
      //change the trex animation
      trex.changeAnimation("collided",trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     if(mousePressedOver(restart)){
     reset();
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}
function reset(){
gameState=PLAY;

obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
trex.changeAnimation("running", trex_running)
score=0



}






function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,365,10,40);
   obstacle.velocityX = -(4+score/30)
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,300,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(280,320))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
    }
}

