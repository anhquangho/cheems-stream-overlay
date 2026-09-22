"use strict";

// Translates OBS Input Overlay WebSocket events into State mutations.
// This module never touches the animation or character layers.
const Input = {
    socket: null,
    heldKeys: new Set(),
    ignoredKeys: new Set(),
    mouseHeld: false,
    crouching: false,

    connect() {
        const socket = new WebSocket(Config.websocket.url);
        socket.onopen = () => console.log("[input] connected to " + Config.websocket.url);
        socket.onclose = () => console.warn("[input] connection closed");
        socket.onerror = () => console.error("[input] connection error");
        socket.onmessage = (message) => {
            let event;
            try {
                event = JSON.parse(message.data);
            } catch (error) {
                return;
            }
            this.handleEvent(event);
        };
        this.socket = socket;
    },

    handleEvent(event) {
        switch (event.event_type) {
            case "key_pressed":
                this.onKeyDown(event.keycode);
                break;
            case "key_released":
                this.onKeyUp(event.keycode);
                break;
            case "mouse_pressed":
                this.onMouseDown(event.button);
                break;
            case "mouse_released":
                this.onMouseUp(event.button);
                break;
        }
    },

    onKeyDown(keycode) {
        if (this.heldKeys.has(keycode) || this.ignoredKeys.has(keycode)) {
            return; // ignore OS auto-repeat
        }
        this.heldKeys.add(keycode);

        const keys = Config.keys;
        if (keycode === keys.reset) {
            this.reset();
            return;
        }
        if (keycode === keys.crouch) {
            this.crouching = true;
        } else if (keycode === keys.weaponSlot1 || keycode === keys.weaponSlot2) {
            State.hasWeapon = true;
            State.weaponSlot = keycode === keys.weaponSlot1 ? 1 : 2;
            State.weaponDrawn = true;
        } else if (keycode === keys.holster) {
            State.hasWeapon = true;
            State.weaponDrawn = !State.weaponDrawn;
            if (State.weaponDrawn) {
                State.weaponSlot = 1;
            }
        }
        this.updateMovement();
    },

    onKeyUp(keycode) {
        this.heldKeys.delete(keycode);
        this.ignoredKeys.delete(keycode);
        if (keycode === Config.keys.crouch) {
            this.crouching = false;
        }
        this.updateMovement();
    },

    onMouseDown(button) {
        if (button === Config.mouse.fire && !this.mouseHeld) {
            this.mouseHeld = true;
            State.firing = true;
            this.updateMovement();
        }
    },

    onMouseUp(button) {
        if (button === Config.mouse.fire) {
            this.mouseHeld = false;
            State.firing = false;
            this.updateMovement();
        }
    },

    reset() {
        for (const keycode of this.heldKeys) {
            this.ignoredKeys.add(keycode);
        }
        this.heldKeys.clear();
        this.crouching = false;
        State.movement = "idle";
        State.hasWeapon = true;
        State.weaponDrawn = false;
        State.weaponSlot = 1;
        State.firing = false;
        State.resetVersion++;
    },

    isMoving() {
        const keys = Config.keys;
        return (
            this.heldKeys.has(keys.forward) ||
            this.heldKeys.has(keys.left) ||
            this.heldKeys.has(keys.back) ||
            this.heldKeys.has(keys.right)
        );
    },

    isSprinting() {
        return (
            this.heldKeys.has(Config.keys.sprintLeft) ||
            this.heldKeys.has(Config.keys.sprintRight)
        );
    },

    updateMovement() {
        if (this.crouching) {
            State.movement = "crouch";
        } else if (!this.isMoving() || (State.weaponDrawn && State.firing)) {
            State.movement = "idle";
        } else {
            State.movement = this.isSprinting() ? "run" : "walk";
        }
    },
};
