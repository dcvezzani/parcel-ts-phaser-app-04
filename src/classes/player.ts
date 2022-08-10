import { Actor } from './actor';
import { handleKeyDown, handleKeyUp } from './MyKeyboardEvents';

export class Player extends Actor {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'king');

        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);
    }

    create(): void {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        this.scene.events.on('destroy', () => {
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
}
