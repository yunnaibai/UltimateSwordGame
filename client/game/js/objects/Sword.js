import {ctx} from "../canvas.js"

export class Sword{
    constructor(options){
        this.playerPos = options.playerPos
        this.size = options.size
        this.color = options.color
        this.side = options.side
        this.pos = [0, 0]
        this.originRotation = 0
        this.rotation
        this.active = false
        this.pos[1] = -this.size[1]
        this.pos[0] = 0
    }
    swing(dt){
        console.log("swing")
        this.side ? ctx.rotate(dt * 2 * Math.PI / 180) : ctx.rotate(dt * -2 * Math.PI / 180)
        
    }
    drawSword(dt){
        ctx.save()
        this.side ? ctx.translate(this.playerPos[0] + 60, this.playerPos[1] + 80) : ctx.translate(this.playerPos[0] - this.size[0] - 10, this.playerPos[1] + 80)
        

        ctx.fillStyle = this.color
        if(this.active){
            this.swing(dt)
            ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
        }else{
            ctx.fillStyle = this.color
            ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
        }
        ctx.restore()
    }
}