class MainGame extends Phaser.Scene{
    constructor(){
        super("mainGame");
        this.my = {sprite:{}, text:{}};

        //group all bullet sprites together
        this.my.sprite.bullet = [];
        this.maxBullets = 10;

        this.score = 0;
        this.highScore = 0;

        this.isDead = false;//checker for if the player is dead

        //timer for the frames for when the player gets hit for the health system
        this.invincibilityTimer = 0;
        this.invinvibilityDelay = 1.5;
    }

    preload(){
        this.load.setPath("./assets/");
        //sprite assets from Kenny Alien UFO pack
        //https://kenney.nl/assets/alien-ufo-pack
        this.load.image("alien", "shipPink_manned.png");
        this.load.image("laser", "laserPink3.png");
        this.load.image("cowLaser", "laserGreen2.png");
        this.load.image("buffaloLaser", "laserGreen_burst.png");
        //sprite assets from Kenny Animal Pack Remastered
        //https://kenney.nl/assets/animal-pack-remastered
        this.load.image("chick", "chick.png");
        this.load.image("chicken", "chicken.png");
        this.load.image("cow", "cow.png");
        this.load.image("buffalo", "buffalo.png");
        //sprite assets from Kenny Particle Pack
        this.load.image("starExplode00", "star_09.png");
        this.load.image("starExplode01", "star_05.png");

        //assets for explosion animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        //audio asset from Kenny Sci-fi Sounds pack
        //https://kenney.nl/assets/sci-fi-sounds
        this.load.audio('boom', 'laserLarge_001.ogg');
        //audio asset from pixabay
        //https://pixabay.com/music/search/gaming/
        this.load.audio('backgroundMusic', 'bgMusicCMPM120.mp3')
        // Sound asset from the Kenny Music Jingles pack 
        // https://kenney.nl/assets/music-jingles
        // sound for when player dies (gets hit)
        this.load.audio('deathSound', 'jingles_HIT15.ogg');

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create(){
        let my = this.my;
        
        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "alien");
        my.sprite.player.setScale(0.75);
        my.sprite.player.health = 3;
        my.sprite.player.maxHealth = 3;

        my.sprite.cow = this.add.sprite((Math.random()*game.config.width)/2, 80, "cow");
        my.sprite.cow.setScale(0.75);
        my.sprite.cow.health = 3;
        my.sprite.cow.maxHealth = 3;
        my.sprite.cow.scorePoints = 15;
        my.sprite.cow.bullet = [];
        my.sprite.cow.maxBullets = 10;
        my.sprite.cow.bulletSpeed = 100;
        my.sprite.cow.bulletTimer = 0;
        my.sprite.cow.bulletDelay = 2; //2 second delay

        my.sprite.chicken = this.add.sprite((Math.random()*game.config.width)/2, 80, "chicken");
        my.sprite.chicken.setScale(0.50);
        my.sprite.chicken.health = 2;
        my.sprite.chicken.maxHealth = 2;
        my.sprite.chicken.scorePoints = 10;

        my.sprite.chick = this.add.sprite((Math.random()*game.config.width)/2, 80, "chick");
        my.sprite.chick.setScale(0.25);
        my.sprite.chick.health = 1;
        my.sprite.chick.maxHealth = 1;
        my.sprite.chick.scorePoints = 5;

        my.sprite.buffalo = this.add.sprite((Math.random()*game.config.width)/2, 80, "buffalo");
        my.sprite.buffalo.health = 5;
        my.sprite.buffalo.maxHealth = 5;
        my.sprite.buffalo.scorePoints = 25;
        my.sprite.buffalo.bullet = [];
        my.sprite.buffalo.maxBullets = 10;
        my.sprite.buffalo.bulletSpeed = 100;
        my.sprite.buffalo.bulletTimer = 0;
        my.sprite.buffalo.bulletDelay = 3; //3 second delay

        //keep the enemy sprites grouped together
        this.enemyGroup = this.add.group();
        this.enemyGroup.add(my.sprite.cow);
        this.enemyGroup.add(my.sprite.chicken);
        this.enemyGroup.add(my.sprite.chick);
        this.enemyGroup.add(my.sprite.buffalo);
        
        //create animation for when the animals (enemies) get abducted
        this.anims.create({
            key: "star",
            frames: [
                {key: "starExplode00"},
                {key: "starExplode01"}
            ],
            frameRate: 20,
            repeat: 4,
            hideOnComplete:true
        });

        //animation for when player dies
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        //sound for when animals get abducted
        this.boomSound = this.sound.add('boom', {volume:1});

        //sound for when player dies
        this.deathSound = this.sound.add('deathSound', {volume: 1});

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 300;
        this.bulletSpeed = 300;
        my.sprite.cow.speed = 25;
        my.sprite.chicken.speed = 40;
        my.sprite.chick.speed = 50;
        my.sprite.buffalo.speed = 20;


        document.getElementById('description').innerHTML = '<h2>MainGame.js</h2><br>A: left // D: right // Space: fire/emit';

        //add background music
        this.bgMusic = this.sound.add('backgroundMusic', {volume: 0.5, loop: true});
        this.bgMusic.play();

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 5, "rocketSquare", "Score " + this.score, 30);

        //Put health on screen
        my.text.health = this.add.bitmapText(580, 30, "rocketSquare", "Health " + my.sprite.player.health, 30);
        // Put title on screen
        my.text.title = this.add.bitmapText(10, 5, "rocketSquare", "Earth Invasion!", 30);

        this.init_game();//call for when the game is reset
    }

    update(time,delta){
        let my = this.my;
        let dt = delta/1000;

        //move left
        if(this.left.isDown){
            if(my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed * dt;
            }
        }

        //move right
        if(this.right.isDown){
            if(my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))){
                my.sprite.player.x += this.playerSpeed * dt;
            }
        }

        //space for bullet
        if(Phaser.Input.Keyboard.JustDown(this.space)){
            if(my.sprite.bullet.length < this.maxBullets){
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "laser").setScale(0.5)
                );
            }
        }

        //remove offscreen bullets and puts it back in the array so it can be used again
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        //handle collision for when the bullet hits the enemy
        for(let bullet of my.sprite.bullet){
            for(let enemy of this.enemyGroup.getChildren()){
                if(this.collides(enemy, bullet)){
                    bullet.y = -100;
                    enemy.health -= 1;
                    
                    this.boomSound.play();

                    //new enemy appears after star animation
                    if(enemy.health <= 0){
                        this.star = this.add.sprite(enemy.x, enemy.y, "starExplode01").setScale(0.1).play("star");
                        enemy.visible = false;
                        enemy.x = -100;
                        this.score += enemy.scorePoints;
                        this.updateScore();

                        this.star.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>{
                            enemy.visible = true;
                            enemy.x = Math.random()*config.width;
                            enemy.y = 80;
                            enemy.health = enemy.maxHealth;
                        }, this);
                    }
                }
            }
        }

        //handle collision for if the enemies hit the player
        if(this.invincibilityTimer > 0){
            this.invincibilityTimer -= dt;
        }

        if(this.isDead == false){
            for(let enemy of this.enemyGroup.getChildren()){
                //checks if the enemy (animals) collide with the player
                if(this.collides(enemy, my.sprite.player) && this.invincibilityTimer <= 0){
                    my.sprite.player.health -= 1;
                    this.invincibilityTimer = this.invinvibilityDelay;
                    this.updateHealth();
                    this.deathSound.play();
                    if(my.sprite.player.health <= 0){
                        this.collisionDeath();
                    }
                }
                //checks if the enemy bullets collide with the player
                if(enemy.bullet){
                    for(let bullet of enemy.bullet){
                        if(this.collides(bullet, my.sprite.player) && this.invincibilityTimer <= 0){
                            my.sprite.player.health -= 1;
                            this.invincibilityTimer = this.invinvibilityDelay;
                            this.updateHealth();
                            this.deathSound.play();
                            if(my.sprite.player.health == 0){
                                this.collisionDeath();
                    }
                        }
                    }
                }
            }
        }


        //make bullets move
        for(let bullet of my.sprite.bullet){
            bullet.y -= this.bulletSpeed * dt;
        }

        //make enemies move down in direction of player
        for(let enemy of this.enemyGroup.getChildren()){
            enemy.y += enemy.speed * dt;

            //makes enemies shoot the player
            if(enemy == my.sprite.cow || enemy == my.sprite.buffalo){
                enemy.bulletTimer += dt;
                if(enemy.bulletTimer >= enemy.bulletDelay){
                    let laserType = (enemy == my.sprite.cow) ? "cowLaser" : "buffaloLaser";//gets the laser type for the specific enemy

                    if(enemy.bullet.length < enemy.maxBullets){
                        enemy.bullet.push(this.add.sprite(
                            enemy.x, enemy.y+(enemy.displayHeight/2), laserType).setScale(0.5)
                        );
                    }
                    enemy.bulletTimer = 0;
                }
                //make bullets move
                enemy.bullet = enemy.bullet.filter((bullet) => bullet.y < game.config.height + 50); //remove offscreen bullets and puts it back in the array to be used again
                for(let bullet of enemy.bullet){
                    bullet.y += this.bulletSpeed * dt;
                }
            }
            
            //checks if the sprites go offscreen (player misses them), spawns them back at top
            if(enemy.y > game.config.height + 50){
                this.score -= enemy.scorePoints;
                this.updateScore();
                enemy.y = 80;
                enemy.x = Math.random()*game.config.width;
                enemy.bulletTimer = 0;
            }
        }
    }

    //center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {//updates the player's score
        let my = this.my;
        my.text.score.setText("Score " + this.score);
    }

    updateHealth(){//updates the player's health
        let my = this.my;
        my.text.health.setText("Health " + my.sprite.player.health);
    }

    init_game(){//function for resetting all game variables
        let my = this.my;
        my.sprite.player.visible = true;
        my.sprite.player.x = game.config.width/2;
        my.sprite.player.y = game.config.height - 40;

        for(let enemy of this.enemyGroup.getChildren()){
            enemy.visible = true;
            enemy.x = Math.random()*config.width;
            enemy.y = 80;
            enemy.health = enemy.maxHealth;
        }

        this.score = 0;
        this.updateScore();

        this.bgMusic.play();
        
        this.isDead = false;
        my.sprite.player.health = my.sprite.player.maxHealth;

    }

    //function for when the enemy sprites collide with the player and the player dies
    collisionDeath(){
        let my = this.my;
        this.isDead = true;
        this.puff = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "whitePuff03").setScale(0.25).play("puff");
        this.deathSound.play();
        this.bgMusic.stop();
        my.sprite.player.visible = false;

        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            //checks/updates for the highscore
            if(this.score > this.highScore){
                this.highScore = this.score;
                this.registry.set('highScore', this.highScore);
            }
            this.registry.set('finalScore', this.score);//make it so that the score is useable for the end screen
            this.scene.start("endScreen");
        }, this);
    }
}