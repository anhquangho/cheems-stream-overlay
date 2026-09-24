# Cheems Overlay V2

A browser-based animated Cheems overlay rendered with PixiJS, WebGL, and Spine. It mirrors keyboard and mouse events from the OBS Input Overlay plugin on the same PC as PUBG and OBS Studio.

> **Project status:** The active application is in `js/`, loaded by `index.html` as classic scripts. It supports transparent rendering, layered animation, WebSocket input, weapon transitions, and manual pose reset. `src/` and `libs/` contain an earlier prototype and are not loaded by the current entry point.

## Features

- Transparent, full-window canvas with viewport resizing
- Spine skeleton, atlas, texture, and mesh animation support
- Movement on track 0 and upper-body actions on track 1
- Idle, walking, running, hold-to-crouch, drawing/holstering, and firing
- Interruptible weapon transitions for quick `X → X` and `X → 1` inputs
- Standing movement pauses while firing a drawn weapon and resumes from held movement keys when firing is released
- F10 reset to standing idle with the weapon holstered
- Input from the OBS Input Overlay WebSocket server at `ws://localhost:16899`

## Tech stack

- JavaScript classic scripts with shared `Config`, `State`, `Input`, `Animation`, and `Character` objects
- PixiJS 7.4.3 from `js/pixi.min.js`
- Spine Pixi v7 runtime from `js/spine-pixi-v7.min.js`
- Spine assets exported with Spine 4.2.11
- WebGL and Vite

The PixiJS 8 dependency in `package.json` is not used by the current entry point. Do not substitute it for the bundled PixiJS 7 runtime without migrating the application and Spine integration together.

## Requirements

- Node.js compatible with Vite 7
- npm
- A browser with WebGL support
- OBS Studio and the OBS Input Overlay plugin with its WebSocket server enabled

## Installation

```bash
git clone <your-repository-url>
cd cheems-overlay_v2
npm install
```

Replace `<your-repository-url>` with the GitHub URL after creating the repository.

## Development

```bash
npm run dev
```

Open `http://localhost:5173`.

The development server listens on `0.0.0.0`, so it is also accessible on the local network. The intended setup runs PUBG, the input plugin, and the overlay on the same PC.

## Controls

| Input | Overlay behavior |
| --- | --- |
| W / A / S / D | Walking animation |
| Hold either Shift with movement | Running animation |
| Hold C | Crouch; releasing C stands back up |
| 1 / 2 | Select and draw the corresponding weapon slot; pressing the same slot again does not holster |
| X while drawn | Holster, including during firing or running transitions |
| X while holstered | Draw slot 1 |
| Hold left mouse | Fire while a weapon is drawn; if still drawing, begin firing after the draw completes |
| F10 | Immediately reset to standing idle with a holstered weapon and slot 1 selected |

F8/F9 no longer control weapon ownership. Selecting 1/2 or using X assumes a weapon is available; input events alone cannot confirm inventory or whether a slot is empty. Both slots currently use the same Spine weapon artwork.

Each X press changes the target state immediately, without waiting for a double-press timeout. If a draw/holster animation is already playing, its direction can change from its current progress. The latest target wins when several inputs arrive before the next frame.

F10 clears animation tracks, restores the skeleton setup pose, and starts idle/holstered animations on the next update. Keys and the fire button held at reset are ignored until released, preventing auto-repeat or a held mouse button from immediately undoing the reset. After releasing them, 1/2 can draw a weapon normally. Ensure F10 is not assigned to another action in your PUBG or OBS configuration.

## Production build

```bash
npm run build
npm run preview
```

**Known limitation:** The current entry point uses classic scripts outside Vite's public asset directory. Vite warns that it cannot bundle these scripts; a build from the current configuration does not package the required runtime scripts and Spine assets. Use the development server for now rather than relying on `dist/` as a standalone deployment. Production packaging remains a separate task.

## Project structure

```text
cheems-overlay_v2/
├── assets/spine/
│   ├── skeleton.json
│   ├── skeleton.atlas
│   └── skeleton.png
├── js/
│   ├── config.js
│   ├── state.js
│   ├── input.js
│   ├── animation.js
│   ├── character.js
│   ├── main.js
│   ├── pixi.min.js
│   └── spine-pixi-v7.min.js
├── src/
├── libs/
├── index.html
├── package.json
└── vite.config.js
```

The active flow is `Input → State → Animation → Character`. Input owns logical state, animation reads that state on each Pixi ticker update, and Character owns the Spine instance. A reset version in State lets the animation layer discard old tracks without coupling Input to Character.

## Configuration

Runtime settings are defined in `js/config.js`:

| Setting | Default | Description |
| --- | --- | --- |
| `websocket.url` | `ws://localhost:16899` | OBS Input Overlay endpoint |
| `keys` | libuiohook keycodes | Input mapping; `reset: 68` is F10 |
| `mouse.fire` | `1` | Left mouse button |
| `animations.crouchPoseTime` | `0.2` | Hold point in the 0.4-second crouch cycle |
| `character.skeletonPath` | `assets/spine/skeleton.json` | Skeleton asset |
| `character.atlasPath` | `assets/spine/skeleton.atlas` | Texture atlas |
| `character.scale` | `0.4` | Character scale |
| `character.bottomMargin` | `20` | Distance from the bottom edge |
| `character.defaultMix` | `0.15` | Default animation mix duration in seconds |

## Using the overlay in OBS Studio

1. Enable the OBS Input Overlay WebSocket server on port 16899.
2. Start this project with `npm run dev`.
3. Add a **Browser Source** pointing to `http://localhost:5173`.
4. Match the Browser Source dimensions to your stream layout.
5. Test 1/2, X, movement, firing, and F10 while PUBG has focus.

The canvas and page background are transparent. The character stays bottom-center; movement keys animate the character without moving its position across the canvas.

## Verification and known limitations

There is no dedicated test or lint script in `package.json`. Input and animation logic can be exercised using the bundled Spine runtime and skeleton without GPU rendering, but final appearance and input delivery must also be checked in OBS.

Manual regression checks:

- Press 1 repeatedly: it should remain drawn, not alternate between drawing and holstering.
- Press X twice quickly, or X then 1, then fire: the upper body should settle into the latest requested state without getting stuck.
- Hold movement and Shift, then fire: legs should stop; release fire while holding movement to resume running.
- Press F10 during drawing, holstering, firing, crouching, and standing back up: the overlay should return to standing with the weapon holstered.
- Hold keys/mouse across F10: they should not reactivate until released and pressed again.

The current `fire` asset keys translation and rotation on the `body` bone. Its upper-body track therefore overrides part of the crouch pose, including the body's vertical offset. Logical crouch remains active, but clean crouched firing requires adjusting the Spine animation so firing does not override the crouch body transform.

WebSocket reconnection, automatic recovery from missed input releases, and filtering input while game menus are open are not yet implemented. F10 is a manual resynchronization point, not game-state detection.

## Third-party assets and runtime

This repository includes Spine runtime files and Spine-exported character assets. Before redistributing or publishing them, verify that you have the appropriate rights and that their use complies with the applicable Spine Runtime License and asset licenses.

No project-level open-source license has been added yet. Without a license, the repository remains available for viewing but does not grant others permission to copy, modify, or redistribute the project code.

## Roadmap

- Package the active scripts and assets for standalone production builds
- Add WebSocket reconnection and input recovery
- Refine Spine track separation for crouched firing
- Filter unnecessary gameplay input and add further character actions
- Add automated regression tests and OBS screenshots
