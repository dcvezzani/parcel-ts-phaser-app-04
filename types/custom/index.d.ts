type ObjectPoint = {
    height: number;
    id: number;
    name: string;
    point: boolean;
    rotation: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
};

type ObjectButtonOptions = {
    containerHeight: number;
};

type AnimationActionProperties = {
    run: string;
};

type SpriteAndBodyOrigins = {
    spriteOrigin: MatterJS.Vector;
    bodyOrigin: MatterJS.Vector;
};

type ObjectDimensions = {
    w: number;
    h: number;
};

type BodyMargins = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

type BodyMarginsSimple = {
    left: number;
    top: number;
};

interface Callback {
    (scaleX: number): void;
}
