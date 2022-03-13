import {Rectangle} from "./Rectangle.js"
import {ctx} from "../canvas.js"

export class NameTag extends Rectangle{
    constructor(options){
        super(options)
        this.name = options.name,
        this.lives = options.live
    }
    drawText(){
        this.color = "rgba(0, 0, 0, 0.5)"
        ctx.font = "18px Arial"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.fillText(`${this.name} : ${this.lives} ❤`, this.pos[0] + 50, this.pos[1] + 16)
    }
}