# Cheems Overlay V2

A browser-based animated Cheems overlay rendered with WebGL and the Spine runtime. The project uses Vite for local development and is being built as a lightweight overlay that can later react to external events through WebSocket input.

> **Project status:** Early development. The Spine assets are loaded successfully, while animation playback, input handling, state transitions, and WebSocket integration are still being implemented.

## Features

### Currently implemented

- Full-window HTML canvas
- WebGL initialization with an experimental WebGL fallback
- Spine atlas, skeleton, and texture asset loading
- Responsive canvas sizing based on the browser viewport
- Vite development server and production build commands
- Initial modular architecture for the player and application bootstrap

### Planned

- Spine animation playback
- Upper-body and lower-body animation layers
- Character state management
- External input processing
- WebSocket connection at `ws://localhost:16899/`
- Movement, running, crouching, and weapon states
- Transparent background support for streaming software

## Tech stack

- JavaScript (ES modules)
- HTML5 Canvas
- WebGL
- Spine WebGL runtime
- Vite
- PixiJS (installed for planned or experimental rendering work)

## Requirements

- Node.js compatible with Vite 7
- npm
- A browser with WebGL support

## Installation

```bash
git clone <your-repository-url>
cd cheems-overlay_v2
npm install
```

Replace `<your-repository-url>` with the GitHub URL after creating the repository.

## Development

Start the Vite development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

The development server listens on `0.0.0.0`, so it can also be accessed from another device on the same local network by using the host computer's local IP address.

## Production build

Create an optimized build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The generated production files are written to the `dist/` directory.

## Project structure

```text
cheems-overlay_v2/
├── assets/
│   └── spine/                 # Skeleton, atlas, and texture assets
├── libs/
│   ├── spine-core.js          # Spine runtime files
│   ├── spine-player.js
│   └── spine-webgl.js
├── src/
│   ├── animationController.js # Animation control (in progress)
│   ├── app.js                 # Application bootstrap
│   ├── config.js              # Runtime configuration
│   ├── input.js               # External input handling (in progress)
│   ├── main.js                # JavaScript entry point
│   ├── player.js              # WebGL and Spine asset initialization
│   ├── stateMachine.js        # Character state model (in progress)
│   ├── utils.js               # Shared utilities
│   └── websocket.js           # WebSocket client (in progress)
├── index.html
├── package.json
└── vite.config.js
```

## Configuration

Runtime settings are defined in `src/config.js`, including:

| Setting | Default | Description |
| --- | --- | --- |
| `DEBUG` | `true` | Enables debug mode |
| `WEBSOCKET_URL` | `ws://localhost:16899/` | Planned WebSocket server endpoint |
| `ASSET_PATH` | `assets/spine/` | Spine asset directory |
| `BACKGROUND_ALPHA` | `0` | Intended overlay background opacity |
| `CHARACTER_SCALE` | `0.6` | Intended character scale |
| `CHARACTER_X` | Viewport center | Intended horizontal position |
| `CHARACTER_Y` | Viewport center + 200 | Intended vertical position |

Some configuration values are placeholders for features that are not connected to the player yet. The current player loads `assets/spine/skeleton.atlas` and `assets/spine/skeleton.json` directly.

## Using the overlay in OBS Studio

Once transparent rendering is implemented:

1. Start the project with `npm run dev`.
2. Add a **Browser Source** in OBS Studio.
3. Set its URL to `http://localhost:5173`.
4. Match the Browser Source dimensions to your canvas or stream resolution.

The current version uses an opaque WebGL context and a dark page background, so transparent compositing is not available yet.

## Third-party assets and runtime

This repository includes Spine runtime files and Spine-exported character assets. Before redistributing or publishing them, verify that you have the appropriate rights and that their use complies with the applicable Spine Runtime License and asset licenses.

No project-level open-source license has been added yet. Without a license, the repository remains available for viewing but does not grant others permission to copy, modify, or redistribute the project code.

## Roadmap

- Complete skeleton creation and rendering
- Add the render/update loop
- Connect animation tracks and transitions
- Implement WebSocket reconnection and message handling
- Map input events to character states
- Enable alpha transparency
- Add resize handling
- Add OBS setup examples and screenshots
