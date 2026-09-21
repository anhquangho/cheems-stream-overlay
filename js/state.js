"use strict";

// Single source of truth for the character's logical state.
// Written by the input layer, read by the animation layer.
const State = {
    movement: "idle", // "idle" | "walk" | "run" | "crouch"
    hasWeapon: false,
    weaponDrawn: false,
    firing: false,
};
