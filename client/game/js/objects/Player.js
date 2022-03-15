import {Rectangle} from "./Rectangle.js"
import {levelSize} from "../Level.js"
import {NameTag} from "./NameTag.js"
import {Sword} from "./Sword.js"

export class Box extends Rectangle 
{
    constructor(options)
    {
        super(options)
        this.grav = 0.005     // Gravitation: beshcleunigt die Box auf
        this.friction = 0.12     // Widerstand: Bremmst automatisch die Geschwindigkeit auf 0 ab
        this.vel = [0,0]        // Geschwindigkeit
        this.acc = 0           // Beschleunigung
        this.onGround = false   // Gibt an, ob das Objekt auf dem Boden ist
        this.moveLeft = false   // Gibt an, ob sich das Objekt nach links bewegt
        this.moveRight = false
        this.moveUp = false  // Gibt an, ob sich das Objekt nach rechts bewegt
        this.name = options.name
        this.clientPlayer = options.clientPlayer
        this.lives = options.lives
        this.lives = 5
        this.lastVel = 0
        this.nametag = new NameTag({
            pos: [this.pos[0], this.pos[1]],
            size: [100, 22],
            color: "purple",
            name: this.name
        })
        this.sword = new Sword({
            pos: [0, 0],
            playerPos: [0, 0],
            size: [10, 100],
            color: "purple"
        })
        if(this.clientPlayer){
            addEventListener("keydown", (e) => {
                //console.log(e.key)
                if(e.repeat) return
                if(e.key == "ArrowRight" || e.key == "d") this.moveRight = true
                if (e.key == "ArrowLeft" || e.key == "a") this.moveLeft = true
                if(e.key == "ArrowUp" || e.key == "w") this.moveUp = true
                if(e.key == " ") this.sword.active = true
            })
            addEventListener("keyup", (e) => {
                if(e.repeat) return
                if(e.key == "ArrowRight" || e.key == "d") this.moveRight = false
                if (e.key == "ArrowLeft" || e.key == "a") this.moveLeft = false
                if(e.key == "ArrowUp" || e.key == "w") this.moveUp = false
                if(e.key == " ") this.sword.active = false
            })
        }

    }

    update(deltaTime){
        this.vel[0] += this.acc * deltaTime
        if(this.clientPlayer){
        this.vel[0] *= (1 - this.friction)
        }
        this.vel[1] += this.grav * deltaTime

        this.pos[0] += this.vel[0] * deltaTime
        this.pos[1] += this.vel[1] * deltaTime


        //NameTag
        this.nametag.pos[0] = this.pos[0] - this.nametag.size[0] / 2 + this.size[0] / 2
        this.nametag.pos[1] = this.pos[1] - 50
        this.nametag.draw()
        this.nametag.drawText()

        //Sword
        this.sword.playerPos[0] = this.pos[0]
        this.sword.playerPos[1] = this.pos[1]
        this.sword.drawSword(deltaTime)
        this.nametag.lives = this.lives

        //Waffenseite wechseln
        if(this.vel[0] != 0){
            this.lastVel = this.vel[0]
        }
        if(this.lastVel < 0){
            this.sword.side = false
        }else if(this.lastVel > 0){
            this.sword.side = true
        }
    }

    inLevelBounds(){
        if(this.left <= 0){
            this.vel[0] = 0.0
            this.pos[0] = 0
        }
        if(this.right >= levelSize[0]){
            this.vel[0] = 0.0
            this.pos[0] = levelSize[0] - this.size[0]
        } 
        if(this.top <= 0){
            this.vel[1] = 0.0
            this.pos[1] = 0
        } 
        if(this.bottom >= levelSize[1])
        {
            this.vel[1] = 0.0
            this.pos[1] = levelSize[1] - this.size[1]
            this.onGround = true
        }
    }
    move(){
        if(this.moveRight == true){
            this.vel[0] = 0.7
        } else if(this.moveLeft == true){
            this.vel[0] = -0.7
        }
        

        if(this.moveUp == true && this.onGround == true){
            this.onGround = false
            this.vel[1] = -1.5
            //console.log("Up")
        }
        //console.log(this.vel[1])
    }

    sendClientData(socket){
        let tmpVel = [Math.round(this.vel[0] * 10000) / 10000, Math.round(this.vel[1] * 10000) / 10000]
        let tmpPos = [Math.round(this.pos[0] * 10000) / 10000, Math.round(this.pos[1] * 10000) / 10000]
        socket.emit("clientUpdate", {vel: tmpVel, pos: tmpPos, name: localStorage.getItem("username"), lives: this.lives, swing: this.sword.active})
    }
    joinServer(socket){
        let tmpVel = [Math.round(this.vel[0] * 10000) / 10000, Math.round(this.vel[1] * 10000) / 10000]
        let tmpPos = [Math.round(this.pos[0] * 10000) / 10000, Math.round(this.pos[1] * 10000) / 10000]
        socket.emit("clientJoin", {vel: tmpVel, pos: tmpPos, name: localStorage.getItem("username"), lives: this.lives, swing: this.sword.active})
    }

}