import Phaser from 'phaser';
import { GameObjects, Physics, Input } from 'phaser';

export default class Actor extends Phaser.Physics.Arcade.Sprite {
    private _scale: number;
    private debugOrigin!: GameObjects.Arc;
    private debugBoundingBoxCalculatedOrigin!: GameObjects.Arc;
    private debugBoundingBoxPosition!: GameObjects.Arc;
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

        this.setBounce(1);
        this.setCollideWorldBounds(true);

        const startingVelocity: Phaser.Math.Vector2 = this.getStartingVelocity();
        // this.setVelocity(startingVelocity.x, startingVelocity.y);
        this._setScale(this._scale);

        // For debug
        this.setGravityY(-300);
        // this.setVelocity(startingVelocity.x, 0);
        // this.visible = false;

        // For debug
        // this.showPoints();

        this.debugCreateOriginPoints();

        this.keySpace = this.scene.input.keyboard.addKey(32);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.keySpace.on('down', (event: KeyboardEvent) => {
            const spriteScale = Math.abs(this._scale);
            // this.getBody().setSize(sizeFactor * Math.abs(scale), sizeFactor * Math.abs(scale), true);
            const chk = {
                scale: spriteScale,
                sprite: {
                    dimensions: {
                        original: { w: this.width, h: this.height },
                        actual: { w: this.width * spriteScale, h: this.height * spriteScale },
                    },
                    origin: { x: this.x, y: this.y },
                    offset: { x: this.originX, y: this.originY },
                    pos: {
                        x: this.x - this.width * spriteScale * this.originX,
                        y: this.y - this.height * spriteScale * this.originY,
                    },
                },
                body: {
                    pos: { x: this.getBody().x, y: this.getBody().y }, // this is the top/left position
                    dimensions: { actual: { w: this.getBody().width, h: this.getBody().height } },
                    offset: this.getBody().offset, // when scaleX is negative, reverse/mirror x; from top/right
                    origin: {
                        x: this.getBody().x + this.getBody().halfWidth,
                        y: this.getBody().y + this.getBody().halfHeight,
                    },
                    transformOffset: {
                        x: this.getBody().x + this.getBody().halfWidth - this.x,
                        y: this.y - (this.getBody().y + this.getBody().halfHeight),
                    },
                    transformPosActual: {
                        x: this.getBody().x - (this.getBody().x + this.getBody().halfWidth - this.x),
                        y: this.getBody().y - (this.y - (this.getBody().y + this.getBody().halfHeight)),
                    },
                    transformOriginActual: {
                        x:
                            this.getBody().x +
                            this.getBody().halfWidth -
                            (this.getBody().x + this.getBody().halfWidth - this.x),
                        y:
                            this.getBody().y +
                            this.getBody().halfHeight -
                            (this.y - (this.getBody().y + this.getBody().halfHeight)),
                    },
                },
            };

            console.log('>>>positions', JSON.stringify(chk, null, 2));
            // this.createTempPoint(chk.sprite.origin.x, chk.sprite.origin.y, 0xf81186);
            this.createTempPoint(chk.body.transformOffset.x, chk.body.transformOffset.y, 0x188cb5);
            this.createTempPoint(chk.body.transformOriginActual.x, chk.body.transformOriginActual.y, 0x22bacc);
            this.createTempPoint(chk.body.transformPosActual.x, chk.body.transformPosActual.y, 0xdba507);

            this.createTempPoint(chk.sprite.pos.x + 1, chk.sprite.pos.y, 0xdba507);
            this.createTempPoint(this.getTopLeft().x, this.getTopLeft().y, 0x22bacc);

            // TODO: draw rectangle around scaled sprite

            // this.getBody().setOffset(
            //     this.getBody().x + this.getBody().halfWidth - this.x + (this.width - this.getBody().width),
            //     0,
            // );
            // this.setVelocity(-this.getBody().velocity.x, this.getBody().velocity.y);
            // this.scaleX = -this.scaleX;
            // this.showPoints();
        });

        this.on('destroy', () => {
            this.keySpace.removeAllListeners();
        });
    }

    update(): void {
        // this.checkFlip();

        this.debugShowOriginPoints();
    }

    private createTempPoint(x: number, y: number, color = 0xffff00): void {
        let points: GameObjects.Arc = this.scene.add.circle(x, y, Math.abs(5 * this._scale), color);

        setTimeout(() => {
            points.destroy();
        }, 2000);
    }

    // Randomly determine the x velocity (horizontal direction) for a given sprite
    // While the starting x direction randomly selects a negative (left) or positive (right)
    // value, the initial force vectors should always be the same.
    private getStartingVelocity(): Phaser.Math.Vector2 {
        const startingVelocityXValues: number[] = [-200, 200];
        const randomStartingVelocityX: number =
            startingVelocityXValues[Math.floor(Math.random() * startingVelocityXValues.length)];

        return new Phaser.Math.Vector2(randomStartingVelocityX, 200);
    }

    // Setting the scale needs to take into account the starting direction of the sprite
    // To start a sprite facing in the opposite direction of the original, provide a
    // negative scale value when initializing the sprite
    private _setScale(scale: number): void {
        if (this.getBody().velocity.x > 0) this.setScale(-scale, Math.abs(scale));
        else this.setScale(scale, Math.abs(scale));

        const sizeFactor = this.width > this.height ? this.height : this.width;
        this.getBody().setSize(sizeFactor * Math.abs(scale), sizeFactor * Math.abs(scale), true);

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
        console.log('>>>scale', { x: this.scaleX, y: this.scaleY }, this._scale);
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
        else this.getBody().setOffset(this.getBody().width, 0);

        // const calculatedOffsetX = this.x - this.originX * this.getBody().width - this.getBody().x;
        // console.log('>>>calculatedOffsetX', calculatedOffsetX);
        // if (calculatedOffsetX > 0) this.getBody().setOffset(calculatedOffsetX, 0);
    }

    private debugCreateOriginPoints(): void {
        if (this.scene && this.scene.game.config.physics.arcade?.debug) {
            this.debugOrigin = this.scene.add.circle(
                this.x + this.originX,
                this.y + this.originY,
                Math.abs(10 * this._scale),
                0x00ff00,
            );
            this.debugBoundingBoxCalculatedOrigin = this.scene.add.circle(
                this.getBody().x + this.getBody().halfWidth,
                this.getBody().y + this.getBody().halfHeight,
                Math.abs(10 * this._scale),
                0xff0000,
            );
            this.debugBoundingBoxPosition = this.scene.add.circle(
                this.getBody().x,
                this.getBody().y,
                Math.abs(10 * this._scale),
                0x0000ff,
            );
        }
    }

    private debugShowOriginPoints(): void {
        if (this.scene && this.scene.game.config.physics.arcade?.debug) {
            const debugOriginPosition = { x: this.x + this.originX, y: this.y + this.originY };
            const debugBoundingBoxCalculatedOrigin = {
                x: this.getBody().x + this.getBody().halfWidth,
                y: this.getBody().y + this.getBody().halfHeight,
            };
            const debugBoundingBoxPosition = {
                x: this.getBody().x,
                y: this.getBody().y,
            };

            this.debugOrigin.setPosition(debugOriginPosition.x, debugOriginPosition.y);
            this.debugBoundingBoxPosition.setPosition(debugBoundingBoxPosition.x, debugBoundingBoxPosition.y);
            this.debugBoundingBoxCalculatedOrigin.setPosition(
                debugBoundingBoxCalculatedOrigin.x,
                debugBoundingBoxCalculatedOrigin.y,
            );
        }
    }

    private getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}
