import {ctx} from "../canvas.js"

export class Sword{
    constructor(options){
        this.pos = options.pos
        this.playerPos = options.playerPos
        this.size = options.size
        this.color = options.color
        this.originRotation = 0
        this.rotation
        this.active = false
    }
    swing(active){
        this.active = active
    }
    drawSword(){
        ctx.save()
        ctx.translate(this.playerPos[0], this.playerPos[1])
        if(this.active){
            
            
            ctx.fillStyle = this.color
            ctx.rotate(-20 * Math.PI / 180)
            
            console.log("swing")
            ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
            
        }else{
            //ctx.translate(this.playerPos[0], this.playerPos[1])
            ctx.fillStyle = this.color
            ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
        }
        ctx.restore()
    }
}