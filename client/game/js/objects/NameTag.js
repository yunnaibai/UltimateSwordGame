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
        let text = `${this.name} - ${this.lives} ❤`
        ctx.fillText(text, this.pos[0] + this.size[0] / 2, this.pos[1] + 17)
        this.size[0] = ctx.measureText(text).width + 20
    }
}