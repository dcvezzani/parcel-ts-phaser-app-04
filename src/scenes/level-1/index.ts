import { GameObjects, Scene } from 'phaser';
import { Player } from '../../classes/player';

export class Level1 extends Scene {
    // private king!: GameObjects.Sprite;
    private player!: Player;

    constructor() {
        super('level-1-scene');
    }
    create(): void {
        // this.king = this.add.sprite(99, 100, 'king');
        this.player = new Player(this, 100, 100);
        this.player.create();
    }

    update(): void {
        this.player.update();
    }
}