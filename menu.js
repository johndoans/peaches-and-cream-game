class Menu extends Phaser.Scene {

music;

    constructor () {
        super("Menu");
    }

    preload () {
        // All game assets
        this.load.image('sky', 'assets/outdoor.png');
        this.load.spritesheet('idle', 'assets/0 Idle Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jump', 'assets/1 Jump Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('stretch', 'assets/2 Stretch Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('march', 'assets/3 March Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('hug', 'assets/4 Hug Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.audio('dafunk', [
                'assets/music.mp3'
            ]);
    }

    create () {
        // Background
        const background = this.add.image(400, 300, "sky");

        // Text
        const menuText = this.add.text(400, 200, 'Peaches and Cream\nWellness Bag Game', { fontFamily: 'Arial', fontSize: 70, color: '#c51b7d', align: "center", wordWrap: { width: 700 } }).setOrigin(0.5);
        menuText.setStroke('#de77ae', 5);
        const overviewText = this.add.text(400, 330, 'Do the entire P-E-A-C-H dance before time runs out!', { fontFamily: 'Arial', fontSize: 39, color: 'black', align: "center", wordWrap: { width: 700 } }).setOrigin(0.5);

        // Play button
        const button = this.add.text(400, 450, 'Play Game', {
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
            // Re-add scene for later
            this.events.once("destroy", () => {
                this.game.scene.add("Menu", Menu);
            });
            this.scene.start('Game');
            this.scene.remove();
        });

        // Play music
        this.music = this.sound.add('dafunk');
        this.music.play();
        this.music.setLoop(true);
    }
}
