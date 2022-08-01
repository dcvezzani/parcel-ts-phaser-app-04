import Phaser from 'phaser';
import { GameObjects, Physics, Input } from 'phaser';

export default class Actor extends Phaser.Physics.Arcade.Sprite {
    private _scale: number;
    private debugOrigin!: GameObjects.Arc;
    private debugBoundingBoxOrigin!: GameObjects.Arc;
    private keySpace: Input.Keyboard.Key;

    constructor(
        scene: Phaser.Scene,
        spriteName: string,
        position: Phaser.Math.Vector2,
        scale: number,
        gravity?: number | undefined,
    ) {
        super(scene, position.x, position.y, spriteName);

        this._scale = scale;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        if (gravity != undefined) this.setGravityY(gravity);
        // this.setGravityY(-300);

        this.setBounce(1);
        this.setCollideWorldBounds(true);

        const startingVelocity: Phaser.Math.Vector2 = this.getStartingVelocity();
        this.setVelocity(startingVelocity.x, startingVelocity.y);
        this._setScale(this._scale);

        this.debugCreateOriginPoints();

        this.keySpace = this.scene.input.keyboard.addKey(32);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.keySpace.on('down', (event: KeyboardEvent) => {
            this.setVelocity(-this.getBody().velocity.x, this.getBody().velocity.y);
            // this.scaleX = -this.scaleX;
            // if (this.scaleX > 0) this.getBody().setOffset(0, 0);
            // else this.getBody().setOffset(this.width, 0);
            // this.showPoints();
        });

        this.on('destroy', () => {
            this.keySpace.removeAllListeners();
        });
    }

    update(): void {
        this.checkFlip();

        this.debugShowOriginPoints();
    }

    private getStartingVelocity(): Phaser.Math.Vector2 {
        const startingVelocityXValues: number[] = [-200, 200];
        const randomStartingVelocityX: number =
            startingVelocityXValues[Math.floor(Math.random() * startingVelocityXValues.length)];

        return new Phaser.Math.Vector2(randomStartingVelocityX, 200);
    }

    private _setScale(scale: number): void {
        if (this.getBody().velocity.x > 0) this.setScale(-scale, Math.abs(scale));
        else this.setScale(scale, Math.abs(scale));

        // if (this.scaleX < 0) this.getBody().setOffset(this.width, 0);
    }

    private checkFlip(): void {
        this.setDirection(this.body.velocity.x);
    }

    private moveLeft(): void {
        this.scaleX = -this._scale;
    }

    private moveRight(): void {
        this.scaleX = this._scale;
    }

    private showPoints(): void {
        console.log('>>>positions', { x: this.x, y: this.y }, this.getBody().position);
        console.log(
            '>>>dimensions',
            { width: this.width * Math.abs(this._scale), height: this.height * Math.abs(this._scale) },
            { width: this.getBody().width, height: this.getBody().height },
        );
    }

    private setDirection(velocity: number): void {
        if (velocity < 0) {
            this.moveLeft();
        } else {
            this.moveRight();
        }

        if (this.scaleX > 0) this.getBody().setOffset(0, 0);
        else this.getBody().setOffset(this.width, 0);
    }

    private debugCreateOriginPoints(): void {
        if (this.scene && this.scene.game.config.physics.arcade?.debug) {
            this.debugOrigin = this.scene.add.circle(
                this.x + this.originX,
                this.y + this.originY,
                Math.abs(10 * this._scale),
                0x00ff00,
            );
            this.debugBoundingBoxOrigin = this.scene.add.circle(
                this.getBody().x + this.getBody().halfWidth,
                this.getBody().y + this.getBody().halfHeight,
                Math.abs(10 * this._scale),
                0xff0000,
            );
        }
    }

    private debugShowOriginPoints(): void {
        if (this.scene && this.scene.game.config.physics.arcade?.debug) {
            const debugOriginPosition = { x: this.x + this.originX, y: this.y + this.originY };
            const debugBoundingBoxOrigin = {
                x: this.getBody().x + this.getBody().halfWidth,
                y: this.getBody().y + this.getBody().halfHeight,
            };

            this.debugOrigin.setPosition(debugOriginPosition.x, debugOriginPosition.y);
            this.debugBoundingBoxOrigin.setPosition(debugBoundingBoxOrigin.x, debugBoundingBoxOrigin.y);
        }
    }

    private getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}
