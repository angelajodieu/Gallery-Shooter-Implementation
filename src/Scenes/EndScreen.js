class EndScreen extends Phaser.Scene{
    constructor(){
        super("endScreen");
        this.my = {sprite: {}, text: {}};
    }

    preload(){
        //assets already preloaded in MainGame.js
    }

    create(){
        let my = this.my;
        let finalScore = this.registry.get('finalScore');
        let highScore = this.registry.get('highScore');
        my.text.highScoreText = this.add.bitmapText(285, 150, "rocketSquare", "High Score: " + highScore);
        my.text.score = this.add.bitmapText(285, 200, "rocketSquare", "Score: " + finalScore);// og placement is 290, 200
        my.sprite.alien = this.add.sprite(390, 320, "alien");

        this.restart = this.input.keyboard.addKey("R");
        my.text.restartPrompt = this.add.bitmapText(193, 400, "rocketSquare", "Press R to Restart!");
        document.getElementById('description').innerHTML = '<h2>EndScreen.js</h2><br>R: restart';
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.restart)){
            this.scene.start("mainGame");
        }
    }
}