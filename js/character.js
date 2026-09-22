"use strict";

// Owns the single Spine skeleton instance. Applies animations, decides nothing.
const Character = {
    spine: null,
    loaded: false,

    load(onLoaded) {
        PIXI.Assets.add({ alias: "skeletonData", src: Config.character.skeletonPath });
        PIXI.Assets.add({ alias: "skeletonAtlas", src: Config.character.atlasPath });
        PIXI.Assets.load(["skeletonData", "skeletonAtlas"]).then(() => {
            this.spine = spine.Spine.from({ skeleton: "skeletonData", atlas: "skeletonAtlas" });
            this.spine.state.data.defaultMix = Config.character.defaultMix;
            this.spine.scale.set(Config.character.scale);
            this.loaded = true;
            onLoaded(this.spine);
        });
    },

    play(track, name, loop) {
        return this.spine.state.setAnimation(track, name, loop);
    },

    reset() {
        this.spine.state.clearTracks();
        this.spine.skeleton.setToSetupPose();
    },

    // Places the character bottom-center of the given view.
    position(viewWidth, viewHeight) {
        const data = this.spine.skeleton.data;
        const feetOffset = -data.y * Config.character.scale;
        this.spine.x = viewWidth / 2;
        this.spine.y = viewHeight - Config.character.bottomMargin - feetOffset;
    },
};
