import { Scene, GameObjects } from 'phaser';
import { sprites, spriteSheets, spriteSheetJSON, tiles, tileMaps } from '~/src/assets';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }
    preload(): void {
        console.table(sprites);
        this.load.image('king', sprites.king);
        this.load.atlas('a-king', spriteSheets.king, spriteSheetJSON.king);
        this.load.image('tiles', tiles['dungeon-16-16']);
        this.load.tilemapTiledJSON('dungeon', tileMaps.dungeonMap);

        this.load.spritesheet('tiles_spr', tiles['dungeon-16-16'], {
            frameWidth: 16,
            frameHeight: 16,
        });
    }
    create(): void {
        this.scene.start('level-1-scene');
        this.scene.start('ui-scene');
    }
}
