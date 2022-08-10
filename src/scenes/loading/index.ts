import { Scene, GameObjects } from 'phaser';
import { sprites, spriteSheets, spriteSheetJSON } from '~/src/assets';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }
    preload(): void {
        console.table(sprites);

        this.load.image('king', sprites.king);
        this.load.atlas('a-king', spriteSheets.king, spriteSheetJSON.kingAtlas);
    }
    create(): void {
        this.scene.start('level-1-scene');
    }
}
