import {Rectangle} from "./Rectangle.js"
import {levelSize} from "../Level.js"

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
        this.physics = options.physics

        addEventListener("keydown", (e) => {
            //console.log(e.key)
            if(e.repeat) return
            if(e.key == "ArrowRight" || e.key == "d") this.moveRight = true
            if (e.key == "ArrowLeft" || e.key == "a") this.moveLeft = true
            if(e.key == "ArrowUp" || e.key == "w") this.moveUp = true
        })
        addEventListener("keyup", (e) => {
            if(e.repeat) return
            if(e.key == "ArrowRight" || e.key == "d") this.moveRight = false
            if (e.key == "ArrowLeft" || e.key == "a") this.moveLeft = false
            if(e.key == "ArrowUp" || e.key == "w") this.moveUp = false
        })

    }

    update(deltaTime){
        this.vel[0] += this.acc * deltaTime
        this.vel[0] *= (1 - this.friction)
        this.vel[1] += this.grav * deltaTime

        this.pos[0] += this.vel[0] * deltaTime
        this.pos[1] += this.vel[1] * deltaTime
            //console.log(Math.round(this.vel[0] * 100) / 100)
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
        let tmpVel = [Math.round(this.vel[0] * 10000) / 10000, Math.round(this.vel[1] * 100) / 100]
        //let tmpVel = [this.vel[0], this.vel[1]]
        //console.log("vel:", tmpVel)
        socket.emit("clientUpdate", {vel: tmpVel, name: localStorage.getItem("username")})
    }
    joinServer(socket){
        let tmpVel = [Math.round(this.vel[0] * 10000) / 10000, Math.round(this.vel[1] * 100) / 100]
        //let tmpVel = [this.vel[0], this.vel[1]]
        //console.log("vel join:", tmpVel)
        socket.emit("clientJoin", {vel: tmpVel, name: localStorage.getItem("username")})
    }

}