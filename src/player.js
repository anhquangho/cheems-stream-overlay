import { spine } from "../libs/spine-webgl.js";

export class Player {

    constructor() {

        this.canvas = null;
        this.gl = null;

        this.shader = null;
        this.batcher = null;
        this.mvp = null;
        this.assetManager = null;
        this.skeletonRenderer = null;
        this.skeleton = null;
        this.animationState = null;

    }

    init() {

        this.canvas = document.getElementById("canvas");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const config = {
            alpha: false
        };

        this.gl =
            this.canvas.getContext("webgl", config) ||
            this.canvas.getContext("experimental-webgl", config);

        if (!this.gl) {

            alert("WebGL không hỗ trợ");

            return;

        }

        this.shader =
            spine.webgl.Shader.newTwoColoredTextured(this.gl);

        this.batcher =
            new spine.webgl.PolygonBatcher(this.gl);

        this.mvp =
            new spine.webgl.Matrix4();

        this.mvp.ortho2d(
            0,
            0,
            this.canvas.width - 1,
            this.canvas.height - 1
        );

        this.skeletonRenderer =
            new spine.webgl.SkeletonRenderer(this.gl);

        this.assetManager =
            new spine.webgl.AssetManager(this.gl);

        this.assetManager.loadTextureAtlas("assets/spine/skeleton.atlas");
        this.assetManager.loadText("assets/spine/skeleton.json");

        this.waitLoading();


        console.log("WebGL Ready");
        console.log(this.assetManager);

    }

    waitLoading() {

        if (this.assetManager.isLoadingComplete()) {

            this.createSkeleton();

            return;
        }

        requestAnimationFrame(() => this.waitLoading());

    }

    createSkeleton() {

        const atlas =
            this.assetManager.get("assets/spine/skeleton.atlas");

        const atlasLoader =
            new spine.AtlasAttachmentLoader(atlas);

        const skeletonJson =
            new spine.SkeletonJson(atlasLoader);

        skeletonJson.scale = 1;

        const skeletonData =
            skeletonJson.readSkeletonData(
                JSON.parse(
                    this.assetManager.get("assets/spine/skeleton.json")
                )
            );

        console.log(skeletonData);

    }

}