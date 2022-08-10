window.__keysPressed__ = {
    up: false,
    right: false,
    down: false,
    left: false,
};

function handleKey(e, active): void {
    console.log(`key: ${e.key}, active: ${active}`);
    switch (e.key) {
        case 'w':
            window.__keysPressed__.up = active;
            break;
        case 'd':
            window.__keysPressed__.right = active;
            break;
        case 's':
            window.__keysPressed__.down = active;
            break;
        case 'a':
            window.__keysPressed__.left = active;
            break;
    }
}
export function handleKeyDown(e): void {
    handleKey(e, true);
}

export function handleKeyUp(e): void {
    handleKey(e, false);
}
