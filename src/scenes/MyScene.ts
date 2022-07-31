import Phaser from 'phaser';

export default class MyScene extends Phaser.Scene {
    constructor() {
        super('my-scene');
    }

    preload(): void {
        this.load.setBaseURL('./assets');

        this.load.image('cyborg', 'sprites/teen-titans-cyborg.png');
        this.load.image('robin', 'sprites/teen-titans-robin.png');
    }

    create(): void {
        const cyborg = this.physics.add.sprite(100, 100, 'cyborg');
        cyborg.setScale(0.75);
        cyborg.setVelocity(-200, 200);
        cyborg.setBounce(1);
        cyborg.setCollideWorldBounds(true);

        const robin = this.physics.add.image(200, 200, 'robin');
        robin.setScale(-0.5, 0.5);
        // console.log('>>>robin.body.offset', robin.body.offset.x, robin.body.offset.y);
        robin.body.setOffset(robin.body.offset.x + robin.width, robin.body.offset.y);
        robin.setGravityY(500);
        robin.setVelocity(200, 200);
        robin.setBounce(1);
        robin.setCollideWorldBounds(true);

        this.physics.add.collider(cyborg, robin);
    }
}
