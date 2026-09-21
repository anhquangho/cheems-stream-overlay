"use strict";

// Translates OBS Input Overlay WebSocket events into State mutations.
// This module never touches the animation or character layers.
const Input = {
    socket: null,
    heldKeys: new Set(),
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
        if (this.heldKeys.has(keycode)) {
            return; // ignore OS auto-repeat
        }
        this.heldKeys.add(keycode);

        const keys = Config.keys;
        if (keycode === keys.crouch) {
            this.crouching = true;
        } else if (keycode === keys.itemTake) {
            State.hasWeapon = true;
            State.weaponDrawn = false;
        } else if (keycode === keys.itemPutAway) {
            State.hasWeapon = false;
            State.weaponDrawn = false;
        } else if (keycode === keys.weaponSlot1 || keycode === keys.weaponSlot2) {
            if (State.hasWeapon) {
                State.weaponDrawn = !State.weaponDrawn;
            }
        } else if (keycode === keys.holster) {
            if (State.hasWeapon) {
                State.weaponDrawn = false;
            }
        }
        this.updateMovement();
    },

    onKeyUp(keycode) {
        this.heldKeys.delete(keycode);
        if (keycode === Config.keys.crouch) {
            this.crouching = false;
        }
        this.updateMovement();
    },

    onMouseDown(button) {
        if (button === Config.mouse.fire) {
            State.firing = true;
        }
    },

    onMouseUp(button) {
        if (button === Config.mouse.fire) {
            State.firing = false;
        }
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
        } else if (!this.isMoving()) {
            State.movement = "idle";
        } else {
            State.movement = this.isSprinting() ? "run" : "walk";
        }
    },
};
