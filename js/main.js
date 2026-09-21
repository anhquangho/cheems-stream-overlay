"use strict";

// Application entry point: wires rendering, character, animation and input.
(function main() {
    const app = new PIXI.Application({
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
    });
    document.body.appendChild(app.view);

    Character.load((spine) => {
        app.stage.addChild(spine);
        Character.position(app.screen.width, app.screen.height);
        window.addEventListener("resize", () => {
            Character.position(app.screen.width, app.screen.height);
        });

        app.ticker.add(() => Animation.update());
        Input.connect();
    });
})();
