
var player;

Entity = function(type,id,x,y,width,height,img){
	var self = {
		type:type,
		id:id,
		x:x,
		y:y,
		width:width,
		height:height,
		img:img,
	};
	self.update = function(){
		self.updatePosition();
		self.draw();
	}
	self.draw = function(){
		ctx.save();
		var x = self.x - player.x;
		var y = self.y - player.y;
		
		x += WIDTH/2;
		y += HEIGHT/2;
		
		x -= self.width/2;
		y -= self.height/2;
		
		ctx.drawImage(self.img,
			0,0,self.img.width,self.img.height,
			x,y,self.width,self.height
		);
		
		ctx.restore();
	}
	self.getDistance = function(entity2){	//return distance (number)
		var vx = self.x - entity2.x;
		var vy = self.y - entity2.y;
		return Math.sqrt(vx*vx+vy*vy);
	}

	self.testCollision = function(entity2){	//return if colliding (true/false)
		var rect1 = {
			x:self.x-self.width/2,
			y:self.y-self.height/2,
			width:self.width,
			height:self.height,
		}
		var rect2 = {
			x:entity2.x-entity2.width/2,
			y:entity2.y-entity2.height/2,
			width:entity2.width,
			height:entity2.height,
		}
		return testCollisionRectRect(rect1,rect2);
		
	}
	self.updatePosition = function(){}
	
	return self;
}

Player = function(){

	var self = Actor('player','myId',50,40,50,70,Img.player,10,1);
	

	var super_update = self.update;
	self.update = function(){
		super_update();
		if(self.pressingRight || self.pressingLeft || self.pressingDown || self.pressingUp)
		self.spriteAnimCounter+= 0.2;

		if(self.pressingMouseLeft)
			self.performAttack();
		if(self.pressingMouseRight)
			self.performSpecialAttack()
	}

	self.updatePosition = function(){
		if(self.pressingRight)
			self.x += 10;
		if(self.pressingLeft)
			self.x -= 10;	
		if(self.pressingDown)
			self.y += 10;	
		if(self.pressingUp)
			self.y -= 10;	
		
		//ispositionvalid
		if(self.x < self.width/2)
			self.x = self.width/2;
		if(self.x > currentMap.width-self.width/2)
			self.x = currentMap.width - self.width/2;
		if(self.y < self.height/2)
			self.y = self.height/2;
		if(self.y > currentMap.height - self.height/2)
			self.y = currentMap.height - self.height/2;
	}

	self.onDeath = function(){
		var timeSurvived = Date.now()/1000 - timeWhenGameStarted;		
		alert("You lost! You survived for " + timeSurvived + " seconds. Your total score is "+ score+ "." );		
		startNewGame();
	}

	self.pressingDown = false;
	self.pressingUp = false;
	self.pressingLeft = false;
	self.pressingRight = false;

	self.pressingMouseLeft = false;
	self.pressingMouseRight = false;
	return self;
	
}

Actor = function(type,id,x,y,width,height,img,hp,atkSpd){
	var self = Entity(type,id,x,y,width,height,img);

	self.hp = hp;	
	self.hpMax = hp;
	self.atkSpd = atkSpd;
	self.attackCounter = 0;
	self.aimAngle = 0;

	self.spriteAnimCounter = 0;


	self.draw = function(){
		ctx.save();
		var x = self.x - player.x;
		var y = self.y - player.y;
		
		x += WIDTH/2;
		y += HEIGHT/2;
		
		x -= self.width/2;
		y -= self.height/2;

		var frameWidth = self.img.width/4;
		var frameHeight = self.img.height/4;


		var aimAngle = self.aimAngle;
		if(aimAngle < 0)
			aimAngle = 360 + aimAngle;

		var walkingMod = Math.floor(self.spriteAnimCounter)%4;


		var directionMod = 2; //draw right
		if(aimAngle >= 45 && aimAngle < 135) // down
			directionMod = 0;
		else if(aimAngle >= 135 && aimAngle < 225) //left
			directionMod = 1;
		else if(aimAngle >= 225 && aimAngle < 315) //up
			directionMod = 3;
		// angle is calculated by degree you are facing on circle. 
		
		ctx.drawImage(self.img,
			walkingMod*frameWidth,directionMod*frameHeight,frameWidth,frameHeight,
			x,y,self.width,self.height
		);
		
		ctx.restore();
	}
	var super_update = self.update;
	self.update = function(){
		super_update();
		self.attackCounter += self.atkSpd;
		if(self.hp <= 0)
			self.onDeath();
		}
		self.onDeath = function(){};
	
	self.performAttack = function(){
		if(self.attackCounter > 25){	//every 1 sec
			self.attackCounter = 0;
			generateBullet(self);
		}
	}
	
	self.performSpecialAttack = function(){
		if(self.attackCounter > 50){	//every 1 sec
			self.attackCounter = 0;
			
			for(var i = 0 ; i < 360; i++){
				generateBullet(self,i);
			}
			
			// generateBullet(self,self.aimAngle - 5);
			// generateBullet(self,self.aimAngle);
			// generateBullet(self,self.aimAngle + 5);
		}
	}

	
	return self;
}

Enemy = function(id,x,y,width,height,img,hp,atkSpd){
	var self = Actor('enemy',id,x,y,width,height,img,hp,atkSpd);
	Enemy.List[id] = self;

	self.toRemove = false;

	var super_update = self.update;
	self.update = function(){
		super_update();
		self.spriteAnimCounter+= 0.2;

		self.updateAim();
	}

	self.updateAim = function(){
	var diffX = player.x - self.x;
	var diffY = player.y - self.y;
	self.aimAngle = Math.atan2(diffY,diffX)/Math.PI * 180
}
	var super_draw = self.draw;
	self.draw = function(){
		super_draw();
		var x = self.x - player.x + WIDTH/2;
		var y = self.y - player.y + HEIGHT/2 - self.height/2 - 20;
		
		ctx.save();
		ctx.fillStyle = 'red';
		var width = 100*self.hp/self.hpMax;
		if(width < 0)
			width = 0;
		ctx.fillRect(x-50,y,width,10);
		ctx.strokeStyle = 'black';
		ctx.strokeRect(x-50,y,100,10);
		ctx.restore();

	}
	self.onDeath = function(){
		self.toRemove = true;
		
	}
	self.updatePosition = function(){
		var diffX = player.x - self.x;
		var diffY = player.y - self.y;

		if(diffX > 0) 
			self.x += 3;
		else
			self.x -=3;
		if(diffY > 0) 
			self.y += 3;
		else
			self.y -=3;
	}
}
Enemy.List = {};

Enemy.update = function(){
	if(frameCount % 100 === 0)	//every 4 sec
	randomlyGenerateEnemy();
	for(var key in Enemy.List){
		Enemy.List[key].update();
		Enemy.List[key].performAttack();
	}
	for(var key in Enemy.List){
		if(Enemy.List[key].toRemove)
			delete Enemy.List[key];
	}

}


randomlyGenerateEnemy = function(){
	//Math.random() returns a number between 0 and 1
	var x = Math.random()*currentMap.width;
	var y = Math.random()*currentMap.height;
	var height = 200;	
	var width = 200;
	var id = Math.random();
	if(Math.random()<0.5)
		Enemy(id,x,y,width,height,Img.bahamut,5,9999);  //quanity of bullets
	if(Math.random()<0.3)
		Enemy(id,x,y,width,height,Img.dragon,5,9999); //Enemy(id,x,y,width,height,Img.bee,hp,atkspd)
	if(Math.random()<0.4)
		Enemy(id,x,y,width,height,Img.fourdragon,5,9999);


}

Upgrade = function (id,x,y,width,height,category,img){
	var self = Entity('upgrade',id,x,y,width,height,img);
	
	self.category = category;
	Upgrade.List[id] = self;
}
Upgrade.update = function(){
		if(frameCount % 75 === 0)	//every 3 sec
		randomlyGenerateUpgrade();
		for(var key in Upgrade.List){
		Upgrade.List[key].update();
		var isColliding = player.testCollision(Upgrade.List[key]);
		if(isColliding){
			if(Upgrade.List[key].category === 'score')
				score += 1000;
			if(Upgrade.List[key].category === 'atkSpd')
				player.atkSpd += 3;
			delete Upgrade.List[key];
		}
	}
}
Upgrade.List = {};


randomlyGenerateUpgrade = function(){
	//Math.random() returns a number between 0 and 1
	var x = Math.random()*currentMap.width;
	var y = Math.random()*currentMap.height;
	var height = 32;
	var width = 32;
	var id = Math.random();
	
	
	if(Math.random()<0.5){
		var category = 'score';
		var img = Img.upgrade1;
	} else {
		var category = 'atkSpd';
		var img = Img.upgrade2;
	}
	
	Upgrade(id,x,y,width,height,category,img);
}

Bullet = function (id,x,y,spdX,spdY,width,height,combatType){
	var self = Entity('bullet',id,x,y,width,height,imgE);
	
	self.timer = 0;
	self.combatType = combatType;
	self.spdX = spdX;
	self.spdY = spdY;

	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
	

	if (self.x < 0 || self.x > currentMap.width){
		self.spdX = -self.spdX;
	}
	if (self.y < 0 || self.y > currentMap.height){
		self.spdY = -self.spdY;
	}
}
Bullet.List[id] = self;	
}
Bullet.List = {};

Bullet.update = function(){
	for(var key in Bullet.List){
		var b = Bullet.List[key];
		b.update();
		
		var toRemove = false;
		b.timer++;
		if(b.timer > 75){
			toRemove = true;
		}
		
		if(b.combatType === 'player'){	//bullet was shot by player
			for(var key2 in Enemy.List){
				if(b.testCollision(Enemy.List[key2])){
					toRemove = true;
					 Enemy.List[key2].hp -= 1;
				}				
			}
		} else if(b.combatType === 'enemy'){
			if(b.testCollision(player)){
				toRemove = true;
				player.hp -= 1;
			}
		}	
		
		
		if(toRemove){
			delete Bullet.List[key];
		}
	}
}

generateBullet = function(actor,aimOverwrite){
	//Math.random() returns a number between 0 and 1
	var x = actor.x;
	var y = actor.y;
	var height = 75;
	var width = 75;
	var id = Math.random();

	var combatType = actor.type;
	if(combatType === 'player'){
   imgE = Img.bulletPlayer;}
	else  if(combatType === 'enemy'){
   imgE = Img.bulletEnemy;}
	
	var angle;
	if(aimOverwrite !== undefined)
		angle = aimOverwrite;
	else angle = actor.aimAngle;
	
	var spdX = Math.cos(angle/180*Math.PI)*25;  //velocity of bullet
	var spdY = Math.sin(angle/180*Math.PI)*25;
	Bullet(id,x,y,spdX,spdY,width,height,actor.type,imgE);
}

