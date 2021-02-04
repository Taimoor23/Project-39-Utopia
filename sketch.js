//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var speedButton, speedIMG;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var air,airIMG;
var score;
var gameOver,restart;

var destruction, destructionIMG;

var BG,BGIMG;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  airIMG=loadImage("Air.jpg");
  cloudImage = loadImage("cloud.png");
  speedIMG = loadImage("speed.jpg");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");

  destructionIMG=loadImage("destruction.jpg");

  BGIMG=loadImage("BG.jpg");

}

function setup() {
  createCanvas(displayWidth-10, displayHeight-150);
  
  trex = createSprite(displayWidth/4-300 ,displayHeight-275,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1;
  
  ground = createSprite(displayWidth/2,displayHeight/2+150,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -8;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight/2+250,400,10);
  invisibleGround.visible = false;

  speedButton=createSprite(100,100,50,50);
  speedButton.addImage("speed",speedIMG);
  speedButton.scale=0.2;

  air=createSprite(200,100,50,50);
  air.addImage("jump",airIMG);
  air.scale=0.5;

  destruction=createSprite(300,100,20,20);
  destruction.addImage("destroy",destructionIMG);
  destruction.scale=0.2;

  
  gameOver = createSprite(displayWidth/2,displayHeight/2-200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;
  
  restart = createSprite(displayWidth/2,displayHeight/2-100);
  restart.addImage(restartImg);
  restart.scale = 1;

  gameOver.visible = false;
  restart.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(BGIMG);
  textSize(30);
  fill("black");
  text("Score: "+ score, displayWidth-250,displayHeight/4-150);
  
  if(gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);

    if(keyDown("space") && trex.y >= displayHeight/2+147){
      trex.velocityY = -18;
    }
    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if (mousePressedOver(speedButton)){
    ground.velocityX=-100;
    trex.velocityY = trex.velocityY + 100
    speedButton.visible=false;
    }
    
    if (mousePressedOver(air)){
      trex.velocityY=-30;
      air.visible=false;
      }
      
    if (mousePressedOver(destruction)){
      obstaclesGroup.visible=false;
      destruction.visible=false;
    }

    spawnClouds();
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
     trex.velocityY=-18;
      //gameState=END;
    }
    textSize(25);
    fill("Black");
    text("Game Finsihes when Score over 1200",400,100,200,200);
    if (score>1200){
     gameState=END;
    }
    
  } else if(gameState===END){
      gameOver.visible = true;
      restart.visible = true;

      //set velocity of each game object to 0
      ground.velocityX = 0;
      trex.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);

      //change the trex animation
      trex.changeAnimation("collided",trex_collided);

      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  trex.collide(ground);

  console.log(trex.position);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ground.velocityX = -8;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(displayWidth,displayHeight/4,40,10);
    cloud.y = Math.round(random(displayHeight/4-50,displayHeight/3+100));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -6;
    
     //assign lifetime to the variable
    cloud.lifetime = 525;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(displayWidth,displayHeight-265,10,40);
    obstacle.velocityX = -8;
    
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
    obstacle.scale = 1;
    obstacle.lifetime = 500;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}