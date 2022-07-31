import Phaser from 'phaser';

export default class Actor extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        spriteName: string,
        position: Phaser.Math.Vector2,
        scale: number,
        gravity?: number | undefined,
    ) {
        super(scene, position.x, position.y, spriteName);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(scale);

        const startingVelocityXValues: number[] = [-200, 200];
        const randomStartingVelocityX: number =
            startingVelocityXValues[Math.floor(Math.random() * startingVelocityXValues.length)];
        this.setVelocity(randomStartingVelocityX, 200);
        this.setBounce(1);
        this.setCollideWorldBounds(true);

        if (gravity != undefined) this.setGravityY(gravity);
    }

    create(): void {}
}
