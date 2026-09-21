"use strict";

// Reads State every frame and decides which Spine animations play.
// Track 0 drives full-body movement, track 1 drives the upper body.
const Animation = {
    MOVEMENT_TRACK: 0,
    UPPER_BODY_TRACK: 1,

    currentMovement: null,
    movementEntry: null,
    leavingCrouch: false,
    currentUpperBody: null,
    upperBodyEntry: null,

    update() {
        if (!Character.loaded) {
            return;
        }
        this.updateMovement();
        this.updateUpperBody();
    },

    updateMovement() {
        const anims = Config.animations.movement;

        // Standing back up: wait for the reversed crouch to finish, unless
        // crouch is pressed again mid-way (then sink back down from the
        // current pose).
        if (this.leavingCrouch) {
            if (State.movement === "crouch") {
                this.playCrouch(true);
            } else if (this.movementEntry.isComplete()) {
                this.leavingCrouch = false;
                this.currentMovement = State.movement;
                this.movementEntry = Character.play(this.MOVEMENT_TRACK, anims[State.movement], true);
            }
            return;
        }

        if (State.movement === this.currentMovement) {
            return;
        }

        if (State.movement === "crouch") {
            this.playCrouch(true);
        } else if (this.currentMovement === "crouch") {
            this.playCrouch(false);
        } else {
            this.currentMovement = State.movement;
            this.movementEntry = Character.play(this.MOVEMENT_TRACK, anims[State.movement], true);
        }
    },

    // The crouch animation is a symmetric down-and-up cycle. Going down plays
    // the first half and holds the crouched pose (animationEnd clamp); going
    // up plays the second half. When flipping direction mid-animation, the
    // track time is mirrored so the pose stays continuous.
    playCrouch(down) {
        const previous = this.movementEntry;
        const entry = Character.play(this.MOVEMENT_TRACK, Config.animations.movement.crouch, false);
        const duration = entry.animation.duration;
        if (down) {
            entry.animationEnd = Config.animations.crouchPoseTime;
        }
        if (previous && previous.animation === entry.animation) {
            const previousApplied = Math.min(previous.trackTime, previous.animationEnd);
            entry.trackTime = Math.max(0, duration - previousApplied);
            entry.mixDuration = 0;
        }
        this.movementEntry = entry;
        this.currentMovement = "crouch";
        this.leavingCrouch = !down;
    },

    updateUpperBody() {
        const anims = Config.animations.upperBody;
        const current = this.currentUpperBody;

        if (!State.hasWeapon) {
            State.weaponDrawn = false;
        }

        if (current === null) {
            this.playUpperBody(this.getUnarmedLoop(), true);
            return;
        }

        const isOneShot =
            current === anims.drawWeapon ||
            current === anims.armRunStart ||
            current === anims.armRunEnd ||
            current === anims.fire;

        if (isOneShot) {
            if (current === anims.drawWeapon) {
                const drawing = !this.upperBodyEntry.reverse;
                if (State.weaponDrawn !== drawing) {
                    if (State.hasWeapon) {
                        this.playDrawTransition(State.weaponDrawn);
                    }
                    return;
                }
            }
            if (!this.upperBodyEntry.isComplete()) {
                return;
            }
            this.finishOneShot(current);
            return;
        }

        if (current === anims.unarmedIdle) {
            if (State.hasWeapon) {
                if (State.weaponDrawn) {
                    this.playDrawTransition(true);
                } else {
                    this.playUpperBody(anims.unarmedHolsterIdle, true);
                }
            }
        } else if (current === anims.unarmedHolsterIdle) {
            if (!State.hasWeapon) {
                this.playUpperBody(anims.unarmedIdle, true);
            } else if (State.weaponDrawn) {
                this.playDrawTransition(true);
            }
        } else if (current === anims.armedIdle) {
            if (!State.weaponDrawn) {
                this.playDrawTransition(false);
            } else if (State.firing) {
                this.playUpperBody(anims.fire, false);
            } else if (State.movement === "run") {
                this.playUpperBody(anims.armRunStart, false);
            }
        } else if (current === anims.armRunLoop) {
            if (State.firing) {
                this.playUpperBody(anims.fire, false);
            } else if (!State.weaponDrawn || State.movement !== "run") {
                this.playUpperBody(anims.armRunEnd, false);
            }
        }
    },

    getUnarmedLoop() {
        const anims = Config.animations.upperBody;
        return State.hasWeapon ? anims.unarmedHolsterIdle : anims.unarmedIdle;
    },

    playDrawTransition(forward) {
        const anims = Config.animations.upperBody;
        const previous = this.upperBodyEntry;
        const entry = Character.play(this.UPPER_BODY_TRACK, anims.drawWeapon, false);
        entry.reverse = !forward;
        if (previous && previous.animation === entry.animation && previous.reverse !== entry.reverse) {
            const duration = entry.animation.duration;
            const previousApplied = Math.min(previous.trackTime, duration);
            entry.trackTime = duration - previousApplied;
            entry.mixDuration = 0;
        }
        this.currentUpperBody = anims.drawWeapon;
        this.upperBodyEntry = entry;
    },

    finishOneShot(current) {
        const anims = Config.animations.upperBody;

        if (current === anims.drawWeapon) {
            if (this.upperBodyEntry.reverse) {
                this.playUpperBody(this.getUnarmedLoop(), true);
            } else {
                this.playUpperBody(anims.armedIdle, true);
            }
        } else if (current === anims.armRunStart) {
            this.playUpperBody(anims.armRunLoop, true);
        } else if (current === anims.armRunEnd) {
            if (!State.weaponDrawn) {
                this.playDrawTransition(false);
            } else {
                this.playUpperBody(anims.armedIdle, true);
            }
        } else if (current === anims.fire) {
            if (State.firing && State.weaponDrawn) {
                this.playUpperBody(anims.fire, false);
            } else if (State.weaponDrawn && State.movement === "run") {
                this.playUpperBody(anims.armRunLoop, true);
            } else if (!State.weaponDrawn) {
                this.playDrawTransition(false);
            } else {
                this.playUpperBody(anims.armedIdle, true);
            }
        }
    },

    playUpperBody(name, loop) {
        this.currentUpperBody = name;
        this.upperBodyEntry = Character.play(this.UPPER_BODY_TRACK, name, loop);
    },
};
