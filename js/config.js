"use strict";

const Config = {
    websocket: {
        // Default endpoint of the OBS Input Overlay WebSocket server.
        url: "ws://localhost:16899",
    },

    // libuiohook keycodes (scancode set 1) as sent by OBS Input Overlay.
    keys: {
        forward: 17,      // W
        left: 30,         // A
        back: 31,         // S
        right: 32,        // D
        sprintLeft: 42,   // Left Shift
        sprintRight: 54,  // Right Shift
        crouch: 46,       // C
        holster: 45,      // X
        weaponSlot1: 2,   // 1
        weaponSlot2: 3,   // 2
        itemPutAway: 66,  // F8
        itemTake: 67,     // F9
        reset: 68,
    },

    mouse: {
        fire: 1, // left button
    },

    animations: {
        // The crouch animation is a full down-and-up cycle; this is the time
        // (in seconds) of the fully crouched pose at the middle of the cycle.
        crouchPoseTime: 0.2,
        movement: {
            idle: "idle",
            walk: "walk",
            run: "run",
            crouch: "crouch",
        },
        upperBody: {
            unarmedIdle: "unarmed_idle",
            unarmedHolsterIdle: "unarmed_idle_holster",
            drawWeapon: "draw_weapon",
            armedIdle: "armed_idle",
            armRunStart: "arm_run_start",
            armRunLoop: "arm_run_loop",
            armRunEnd: "arm_run_end",
            fire: "fire",
        },
    },

    character: {
        skeletonPath: "assets/spine/skeleton.json",
        atlasPath: "assets/spine/skeleton.atlas",
        scale: 0.4,
        bottomMargin: 20,
        defaultMix: 0.15,
    },
};
