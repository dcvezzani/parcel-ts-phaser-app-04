import { Game, Types } from 'phaser';
import { Level1, LoadingScene, UIScene } from './scenes';

let sizeChangedTimeout = 0;
window.sizeChanged = () => {
    if (!!sizeChangedTimeout) clearTimeout(sizeChangedTimeout);

    sizeChangedTimeout = setTimeout(() => {
        if (window.game.isBooted) {
            setTimeout(() => {
                window.game.scale.resize(window.innerWidth, window.innerHeight);
                window.game.canvas.setAttribute(
                    'style',
                    `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
                );
            }, 100);
        }
    }, 250);
};

export const gameConfig: GameConfigExtended = {
    title: 'Phaser game tutorial',
    type: Phaser.WEBGL,
    parent: 'game',
    backgroundColor: '#351f1b',
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    callbacks: {
        postBoot: () => {
            window.sizeChanged();
        },
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
    autoFocus: true,
    audio: {
        disableWebAudio: true,
    },
    scene: [LoadingScene, Level1, UIScene],
    winScore: 40,
};

window.game = new Game(gameConfig);

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    window.addEventListener('resize', () => {
        window.sizeChanged();
    });
});
