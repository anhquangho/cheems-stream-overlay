import { Player } from "./player.js";

export class App{

    constructor(){

        this.player = new Player();

        this.player.init();

    }

}