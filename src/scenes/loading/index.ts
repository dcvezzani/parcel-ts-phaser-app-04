import { Scene, GameObjects } from 'phaser';
import { sprites, spriteSheets, spriteSheetJSON, tiles, tileMaps } from '~/src/assets';

// import sprites from './sprites/*.png';
// import spriteSheets from '~/src/assets/spritesheets/*.png';
// import spriteSheetJSON from '~/src/assets/spritesheets/*.json';
// import tiles from '~/src/assets/tilemaps/tiles/*.png';
// import tileMaps from '~/src/assets/tilemaps/tiles/json/*.json';

// import king from '~/src/assets/sprites/king.png';
// import vision from '~/src/assets/sprites/vision4.png';

// const sprites = { king, vision };

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }
    preload(): void {
        console.table(sprites);
        this.load.image('king', sprites.king);
        this.load.image('vision', sprites.vision5);
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
