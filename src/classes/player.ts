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
    }

    update(): void {
        this.getBody().setVelocity(0);

        if (window.__keysPressed__.left) {
            this.getBody().setVelocityX(-110);
            this.checkFlip();
            this.getBody().setOffset(48, 15);
        } else if (window.__keysPressed__.right) {
            this.getBody().setVelocityX(110);
            this.checkFlip();
            this.getBody().setOffset(15, 15);
        }

        if (window.__keysPressed__.up) {
            this.getBody().setVelocityY(-110);
        } else if (window.__keysPressed__.down) {
            this.getBody().setVelocityY(110);
        }
    }
}
