import { GameObjects, Physics, Scene, Tilemaps } from 'phaser';
import { Enemy } from '~/src/classes/enemy';
import { EVENTS_NAME } from '~/src/consts';
import { gameObjectsToObjectPoints } from '~/src/helpers/gameobject-to-object-point';
import { Player } from '../../classes/player';

export class Level1 extends Scene {
    // private king!: GameObjects.Sprite;
    private player!: Player;
    private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset;
    private wallsLayer!: Tilemaps.TilemapLayer;
    private groundLayer!: Tilemaps.TilemapLayer;
    private chests!: Phaser.GameObjects.Sprite[];
    private enemies!: Enemy[];
    private vision!: GameObjects.Image;
    private fog!: GameObjects.RenderTexture;

    constructor() {
        super('level-1-scene');
    }
    create(): void {
        this.initMap();
        this.player = new Player(this, 300, 300);
        this.player.create();
        this.physics.add.collider(this.player, this.wallsLayer);

        this.initChests();

        this.initCamera();

        this.initEnemies();

        this.initFogOfWar();

        // const mask = new Physics.Arcade.Image(this, 250, 250, 'vision');
        // mask.scale = 0.15;
        // this.add.existing(mask);
        // const mask = this.make.image({ key: 'vision', x: 100, y: 100 });

        // const mask = this.make.image({
        //     x: this.scale.width / 2,
        //     y: this.scale.height / 2,
        //     key: 'vision',
        //     add: true,
        // });

        // this.player.mask = new Phaser.Display.Masks.BitmapMask(this, mask);

        // this.input.on('pointermove', function (pointer) {
        //     mask.x = pointer.x - mask.displayWidth;
        //     mask.y = pointer.y - mask.displayHeight;
        // });
    }

    update(): void {
        this.player.update();
        this.updateFogOfWar();
    }

    private initMap(): void {
        this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 });
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        this.groundLayer = this.map.createLayer('Ground', this.tileset);
        this.wallsLayer = this.map.createLayer('Walls', this.tileset);
        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);

        // this.showDebugWalls();
    }

    private showDebugWalls(): void {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
    }
    private initChests(): void {
        const chestPoints = gameObjectsToObjectPoints(
            this.map.filterObjects('Chests', (obj) => obj.name === 'ChestPoint'),
        );
        this.chests = chestPoints.map((chestPoint) =>
            this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5),
        );
        this.chests.forEach((chest) => {
            this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
                this.game.events.emit(EVENTS_NAME.chestLoot);
                obj2.destroy();
                this.cameras.main.flash();
            });
        });
    }

    private initCamera(): void {
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(2);
    }

    private initEnemies(): void {
        const enemiesPoints = gameObjectsToObjectPoints(
            this.map.filterObjects('Enemies', (obj) => obj.name === 'EnemyPoint'),
        );
        this.enemies = enemiesPoints.map((enemyPoint) =>
            new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.player, 503)
                .setName(enemyPoint.id.toString())
                .setScale(1.5),
        );
        this.physics.add.collider(this.enemies, this.wallsLayer);
        this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
            (obj1 as Player).getDamage(1);
        });
    }

    private initFogOfWar(): void {
        // make a RenderTexture that is the size of the screen
        this.fog = this.make.renderTexture(
            {
                width: this.scale.width,
                height: this.scale.height,
            },
            true,
        );
        // fill it with black
        this.fog.fill(0x000000, 1);
        // draw the floorLayer into it
        this.fog.draw(this.groundLayer);
        // set a dark blue tint
        this.fog.setTint(0x0a2948);

        this.vision = this.make.image({
            x: this.player.x,
            y: this.player.y,
            key: 'vision',
            add: false,
        });

        // this.vision.scale = 2.5;
        this.vision.scale = 2.5;
        this.fog.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
        this.fog.mask.invertAlpha = true;
    }

    private updateFogOfWar(): void {
        if (this.vision) {
            this.vision.x = this.player.x;
            this.vision.y = this.player.y;
            this.fog.x = this.player.x - this.fog.displayWidth / 2;
            this.fog.y = this.player.y - this.fog.displayHeight / 2;
        }
    }
}
