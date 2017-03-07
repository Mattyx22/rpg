var game = new Phaser.Game(800, 600, Phaser.AUTO, 'rpg', { preload: preload, create: create, update: update });
var map;
var layer;
var przeszkody;
var upKey;
var downKey;
var leftKey;
var rightKey;
var runKey;
var cursors;
var hud;
var sprint = 100;
var sprintText;

function preload() {
	game.load.spritesheet('player', 'assets/player.png', 32, 32);
	
	//tileset preload
	game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', 'assets/tileset.png');
	game.load.image('panel', 'assets/panel.png');
}

function create() {
	loadMap();
	createPlayer();
	gui();
}

function update() {
	movePlayer();
	if (runKey.isDown){
		if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown || leftKey.isDown || rightKey.isDown || upKey.isDown || downKey.isDown) {
			if (sprint > 0){
			 sprint -= 0.1;
			}
			else if (sprint == 0) {
			 sprint == 0;	
			}
		}
	}
}


// Functions used above are below :)
function loadMap() {
	//game world
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	platforms = game.add.group();
	platforms.enableBody = true;
	
	//world load (tileset)
	game.stage.backgroundColor = '#787878';
	game.world.setBounds(0, 0, 1920, 1920);
	map = game.add.tilemap('map');
	
	map.addTilesetImage('ziemia', 'tiles', 32, 32, 0, 0, 1);
	
	map.addTilesetImage('obiekty', 'tiles', 32, 32, 0, 0, 1);
	//addTilesetImage(tileset, key, tileWidth, tileHeight, tileMargin, tileSpacing, start id - in tiled 0 is empty);
	ziemia = map.createLayer('ziemia');
	obiekty = map.createLayer('obiekty');
	
	player = game.add.sprite(250, 300, 'player');
	
	nad = map.createLayer('nad');
	//collisions
	przeszkody = map.createLayer('przeszkody');
	game.physics.arcade.enable(przeszkody);
	map.setCollisionBetween(0, 10000, true, przeszkody);
	ziemia.resizeWorld();
}

function createPlayer(){
	//player
	//player = game.add.sprite(320, game.world.height - 150, 'player');
	game.physics.arcade.enable(player);
	player.animations.add('left', [3, 4, 5], 10, true);
	player.animations.add('right', [6, 7, 8], 10, true);
	player.animations.add('down', [0, 1, 2], 10, true);
	player.animations.add('up', [9, 10, 11], 10, true);
	
	
	//defining cursors, wsad and running
	cursors = game.input.keyboard.createCursorKeys();
	
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	runKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	
	//camera follow
	player.anchor.setTo(0,0);
	game.physics.enable(player);
    game.camera.follow(player);
}

function movePlayer(){
	//collisions	
	game.physics.arcade.collide(player, przeszkody);
	
	//player movement 
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	
	if (cursors.left.isDown || leftKey.isDown) {
		player.body.velocity.x = -150;
		player.animations.play('left');	
	}
	else if (cursors.right.isDown || rightKey.isDown) {
		player.body.velocity.x = 150;
		player.animations.play('right');
	}
	else if (cursors.up.isDown || upKey.isDown) {
		player.body.velocity.y = -150;
		player.animations.play('up');
	}
	else if (cursors.down.isDown || downKey.isDown) {
		player.body.velocity.y = 150;
		player.animations.play('down');
	}
	else {
		player.animations.stop()
		player.frame = 12;
	}
	
	//sprint if sprint variable is higher than 0
	if (sprint > 0){
		if(cursors.left.isDown && runKey.isDown || leftKey.isDown && runKey.isDown){
			player.body.velocity.x = -300;
			player.animations.play('left');
		}
		else if(cursors.right.isDown && runKey.isDown || rightKey.isDown && runKey.isDown){
			player.body.velocity.x = 300; 
			player.animations.play('right'); 
		}
		else if(cursors.up.isDown && runKey.isDown || upKey.isDown && runKey.isDown) {
			player.body.velocity.y = -300;
			player.animations.play('up');
		}	
		else if(cursors.down.isDown && runKey.isDown || downKey.isDown && runKey.isDown) {
			player.body.velocity.y = 300;
			player.animations.play('down');
		}
	}
		
	
	// checking the state of sprint and showing it to player 
	if (sprint >= 70){
		sprintText.text = 'Energy: full' ;
	}
	else if (sprint >= 40){
		sprintText.text = 'Energy: tired' ;	
	}
	else if (sprint <= 0){
		sprintText.text = 'Energy: exhausted' ;
	}
		
	if (runKey.isUp){
		if (sprint == 100){
			// don't do anything
		}
		else if (sprint < 100){
			sprint += 0.2;
		}
	}
}

function gui() {
	sprintText = game.add.text(10, 550, 'Energy: full' , {font: '25px Arial'});
	sprintText.fixedToCamera = true;
	
	
}