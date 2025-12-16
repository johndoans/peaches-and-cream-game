class Game extends Phaser.Scene {

player;
background;
clock = 60;
gameOver = false;
scoreText;
instructionText;

left_moves = 0;
right_moves = 0;
march_moves = 0;
hug_moves = 0;
jump_moves = 0;
stretch_moves = 0;

stage = 0;
music;
isClicking = false;

stageText = [
    "P \n Jump up high like a Peach Pop 5 times! \n Swipe UP to jump!",
    "E \n Stretch your arms out wide with energy 5 times! \n Swipe DOWN to stretch!",
    "A \n March in place, nice and strong 5 times! \n Tap the peach to march!",
    "C \n Open your arms wide like a big hug 5 times! \n Tap outside the peach to hug!",
    "H \n Hop side to side with a smile 5 times left and right! \n Swipe LEFT and RIGHT to move!",
];

    constructor () {
        super("Game");
    }

    preload () {
    }

    create () {
        // Get deltatime for precise timings
        this.timestep = new Phaser.Core.TimeStep(this.game, { forceSetTimeOut: true,
            target: 60, limit: 60 });

        // Switching assets to be more pixelated
        this.textures.get("idle").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("jump").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("stretch").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("march").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("hug").setFilter(Phaser.Textures.FilterMode.NEAREST);
        
        //  A simple background for our game
        this.background = this.add.image(400, 300, 'sky');

        // The player and its settings
        this.player = this.physics.add.sprite(400, 450, 'idle').setScale(3);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //  Add some drag
        this.player.setDamping(true);
        this.player.setDragX(0.001);

        // Play music
        this.music = this.sound.add('dafunk');
        this.music.play();
        this.music.setLoop(true);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 8 }),
            frameRate:8,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 5 }),
            frameRate:8,
            repeat: 5
        });

        this.anims.create({
            key: 'stretch',
            frames: this.anims.generateFrameNumbers('stretch', { start: 0, end: 6 }),
            frameRate:8,
            repeat: 0
        });

        this.anims.create({
            key: 'march',
            frames: this.anims.generateFrameNumbers('march', { start: 0, end: 5 }),
            frameRate:8,
            repeat: 0
        });

        this.anims.create({
            key: 'hug',
            frames: this.anims.generateFrameNumbers('hug', { start: 0, end: 5 }),
            frameRate:8,
            repeat: 0
        });

        // Set up player more
        this.player.anims.play('idle', true);
        this.player.setInteractive();
        this.player.on("pointerup", pointer => {
            // March on tap
            this.player.anims.play("march", true);
            this.player.anims.playAfterRepeat("idle");
            this.march_moves += 1;
        });

        // Set up background for tapping (for one of the moves)
        this.background.setInteractive();
        this.background.on("pointerup", pointer => {
            // Hug on background tap only if it's a tap and not a swipe
            if (Math.abs(pointer.upTime - pointer.downTime) <= 200) {
                this.player.anims.play("hug", true);
                this.player.anims.playAfterRepeat("idle");
                this.hug_moves += 1;
            }
        });

        //  The score
        this.scoreText = this.add.text(16, 16, 'Time: 0', { fontSize: '39px', fill: 'black', fontFamily: 'Arial' });
        this.instructionText = this.add.text(400, 200, '', { fontFamily: 'Arial', fontSize: 48, color: '#c51b7d', align: "center", wordWrap: { width: 700 } }).setOrigin(0.5);
        this.instructionText.setStroke('#de77ae', 5);
    }

    update (times, delta) {
        var swipeDirection = "";

        // Time's up!
        if (this.clock <= 0 && this.stage != 5) {
            this.stage = 6;
            this.gameOver = true;
            this.scoreText.destroy();
        }

        if (!this.gameOver) {
            // Detect swipes
            if (!this.input.activePointer.isDown && this.isClicking == true) {
                if (Math.abs(this.input.activePointer.upY - this.input.activePointer.downY) >= 80) {
                    if (this.input.activePointer.upY < this.input.activePointer.downY) {
                        swipeDirection = "up";
                    } else if (this.input.activePointer.upY > this.input.activePointer.downY) {
                        swipeDirection = "down";
                    }
                } else if (Math.abs(this.input.activePointer.upX - this.input.activePointer.downX) >= 30) {
                    if (this.input.activePointer.upX < this.input.activePointer.downX) {
                        swipeDirection = "left";
                    } else if (this.input.activePointer.upX > this.input.activePointer.downX) {
                        swipeDirection = "right";
                    }
                }
                this.isClicking = false;
            } else if (this.input.activePointer.isDown && this.isClicking == false) {
                this.isClicking = true;
            }

            // Move based on swipes
            if (swipeDirection == "left") {
                // Hop left
                this.player.setVelocityX(-400);
                this.player.setVelocityY(-130);
    
                if (this.player.anims.isPlaying && this.player.anims.getName() != "jump") {
                    this.player.anims.play('march', true);
                    this.player.anims.playAfterRepeat('idle'); 
                }
                this.left_moves += 1;
            } else if (swipeDirection == "right") {
                // Hop right
                this.player.setVelocityX(400);
                this.player.setVelocityY(-130);
    
                if (this.player.anims.isPlaying && this.player.anims.getName() != "jump") {
                    this.player.anims.play('march', true);
                    this.player.anims.playAfterRepeat('idle'); 
                }
                this.right_moves += 1;
            } else if (swipeDirection == "down") {
                // Stretch
                this.player.anims.play('stretch', true);
                this.player.anims.playAfterRepeat('idle'); 
                this.stretch_moves += 1;
            }
            else if (swipeDirection == "up" && this.player.body.onFloor()) 
            {
                // Jump
                this.player.setVelocityY(-300);
                this.player.anims.play('jump', true); 
                this.player.anims.playAfterRepeat('idle'); 
                this.jump_moves += 1;
            }
        }

        // Update clock
        if (this.stage != 5 && this.stage != 6 && !this.gameOver) {
            this.clock -= 0.001*delta;
            this.scoreText.setText('Time: ' + Math.floor(this.clock));
        }

        // Update instruction text
        this.instructionText.setText(this.stageText[this.stage]);

        // Shown instruction depends on number of movements
            if (this.stage == 0) {
                // P (Jump)
                if (this.jump_moves >= 5) {
                    this.stage = 1;
                    this.resetMoves();
                }
            } else if (this.stage == 1) {
                // E (Stretch)
                if (this.stretch_moves >= 5) {
                    this.stage = 2;
                    this.resetMoves();
                }
            } else if (this.stage == 2) {
                // A (March)
                if (this.march_moves >= 5) {
                    this.stage = 3;
                    this.resetMoves();
                }
            } else if (this.stage == 3) {
                // C (Hug)
                if (this.hug_moves >= 5) {
                    this.stage = 4;
                    this.resetMoves();
                }
            } else if (this.stage == 4) {
                // H (Hop left and right)
                if (this.left_moves >= 5 && this.right_moves >= 5) {
                    this.stage = 5;
                    this.gameOver = true;
                    this.resetMoves();
                }
            } else if (this.stage == 5) {
                // Win screen
                this.instructionText.setText( 'Congratulations, you did the P-E-A-C-H dance! \n You finished in ' + Math.floor(60 - this.clock) + " seconds!" );
                this.scoreText.destroy();
                this.player.destroy();
                
                const button = this.add.text(400, 400, 'Main Menu', {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    color: '#ffffff',
                    align: 'center',
                    fixedWidth: 260,
                    backgroundColor: '#2d2d2d'
                }).setPadding(32).setOrigin(0.5);

                button.setInteractive({ useHandCursor: true });

                button.on('pointerover', () => {
                    button.setBackgroundColor('#8d8d8d');
                });

                button.on('pointerout', () => {
                    button.setBackgroundColor('#2d2d2d');
                });

                button.on('pointerdown', () => {
                    this.music.stop();
                    // Re-add the scene for later
                    this.events.once("destroy", () => {
                        this.game.scene.add("Game", Game);
                    });
                    this.scene.start("Menu");
                    this.scene.remove();
                });
            } else if (this.stage == 6) {
                // Lose screen
                this.instructionText.setText( "Unfortunately, you did not do the entire dance in time. But you can always try again!" );
                this.scoreText.destroy();
                this.player.destroy();

                const button = this.add.text(400, 400, 'Main Menu', {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    color: '#ffffff',
                    align: 'center',
                    fixedWidth: 260,
                    backgroundColor: '#2d2d2d'
                }).setPadding(32).setOrigin(0.5);

                button.setInteractive({ useHandCursor: true });

                button.on('pointerover', () => {
                    button.setBackgroundColor('#8d8d8d');
                });

                button.on('pointerout', () => {
                    button.setBackgroundColor('#2d2d2d');
                });

                button.on('pointerdown', () => {
                    this.music.stop();
                    // Re-add the scene for later
                    this.events.once("destroy", () => {
                        this.game.scene.add("Game", Game);
                    });
                    this.scene.start("Menu");
                    this.scene.remove();
                });
            }
    }

    resetMoves ( ) {
            // Reset moving for next stage
            this.left_moves = 0;
            this.jump_moves = 0;
            this.right_moves = 0;
            this.hug_moves = 0;
            this.stretch_moves = 0;
            this.march_moves = 0;
    }
}
