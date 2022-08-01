import Phaser from 'phaser';
import Actor from '~/classes/actor';
import AlignGrid from '~/util/AlignGrid';

export default class MyScene extends Phaser.Scene {
    private actors: Actor[];
    constructor() {
        super('my-scene');
        this.actors = [];
    }

    preload(): void {
        this.load.setBaseURL('./assets');

        this.load.image('cyborg', 'sprites/teen-titans-cyborg.png');
        this.load.image('robin', 'sprites/teen-titans-robin.png');
        this.load.image('starfire', 'sprites/teen-titans-starfire.png');
    }

    create(): void {
        const cyborg = new Actor(this, 'cyborg', new Phaser.Math.Vector2(220, 200), -0.75);
        const robins = [
            new Actor(this, 'robin', new Phaser.Math.Vector2(300, 300), -0.5, 500),
            new Actor(this, 'robin', new Phaser.Math.Vector2(400, 400), -0.5, 500),
            new Actor(this, 'robin', new Phaser.Math.Vector2(500, 500), -0.5, 500),
        ];
        const starfire = new Actor(this, 'starfire', new Phaser.Math.Vector2(400, 200), 0.5, 700);

        this.actors = [cyborg, ...robins, starfire];
        // this.actors = [cyborg];

        this.physics.add.collider(this.actors, this.actors);

        // const alignGrid = new AlignGrid({ scene: this, cw: 178.75 });
        // alignGrid.show();
    }

    update(): void {
        this.actors.forEach((actor) => actor.update());
    }
}
