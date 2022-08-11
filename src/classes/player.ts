import { EVENTS_NAME, GameStatus } from '../consts';
import { Actor } from './actor';
import { handleKeyDown, handleKeyUp } from './MyKeyboardEvents';
import { Text } from './text';

const handleSpaceDown = (self: any) =>
    function (event): void {
        if (event.keyCode === 32) {
            if (self?.anims?.play) self.anims.play('attack', true);
            if (self?.scene?.game) self.scene.game.events.emit(EVENTS_NAME.attack);
        }
    };

export class Player extends Actor {
    private hpValue: Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'king');

        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);

        this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
            .setFontSize(12)
            .setOrigin(0.8, 0.5);
    }

    create(): void {
        document.addEventListener('keydown', handleSpaceDown(this));
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        this.scene.events.on('destroy', () => {
            document.removeEventListener('keydown', handleSpaceDown(this));
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        });

        this.initAnimations();
    }

    update(): void {
        this.getBody().setVelocity(0);

        if (window.__keysPressed__.left) {
            this.getBody().setVelocityX(-110);
            this.checkFlip();
            this.getBody().setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        } else if (window.__keysPressed__.right) {
            this.getBody().setVelocityX(110);
            this.checkFlip();
            this.getBody().setOffset(15, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        if (window.__keysPressed__.up) {
            this.getBody().setVelocityY(-110);
            !this.anims.isPlaying && this.anims.play('run', true);
        } else if (window.__keysPressed__.down) {
            this.getBody().setVelocityY(110);
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
        this.hpValue.setOrigin(0.8, 0.5);
    }

    private initAnimations(): void {
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'run-',
                end: 7,
            }),
            frameRate: 8,
        });
        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'attack-',
                end: 2,
            }),
            frameRate: 8,
        });
    }

    public getDamage(value?: number): void {
        super.getDamage(value);
        this.hpValue.setText(this.hp.toString());
        if (this.hp <= 0) {
            this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
        }
    }

    private handleSpaceDown(event): void {
        this.anims.play('attack', true);
        this.scene.game.events.emit(EVENTS_NAME.attack);
    }
}
