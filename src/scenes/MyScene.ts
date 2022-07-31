import Phaser from 'phaser';
import Actor from '~/classes/actor';

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
        const cyborg = new Actor(this, 'cyborg', new Phaser.Math.Vector2(100, 100), 0.75);
        const robins = [
            new Actor(this, 'robin', new Phaser.Math.Vector2(300, 300), 0.5, 500),
            new Actor(this, 'robin', new Phaser.Math.Vector2(400, 400), 0.5, 500),
            new Actor(this, 'robin', new Phaser.Math.Vector2(500, 500), 0.5, 500),
        ];

        this.physics.add.collider([cyborg, ...robins], [cyborg, ...robins]);
    }
}
