import { Scene, GameObjects } from 'phaser';
import images from '~/src/assets/sprites';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }
    preload(): void {
        // this.load.baseURL = 'assets/';

        console.table(images);

        // key: 'king'
        // path from baseURL to file: 'sprites/king.png'
        // this.load.image('king', './sprites/king.png');
        this.load.image('king', images.king);
    }
    create(): void {
        this.scene.start('level-1-scene');
    }
}
